import base64
import os

import requests

SONARQUBE_URL = os.environ.get("SONARQUBE_URL")
SONARQUBE_TOKEN = os.environ.get("SONARQUBE_TOKEN")

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_REPO_NAME = os.environ.get("GITHUB_REPO_NAME")
GITHUB_PR_NUMBER = os.environ.get("GITHUB_PR_NUMBER")

if not all([SONARQUBE_URL, SONARQUBE_TOKEN, GITHUB_TOKEN, GITHUB_REPO_NAME, GITHUB_PR_NUMBER]):
    print("Error: One or more required environment variables are not set.")
    exit(1)

METRICS = {
    "bugs": "Bugs",
    "vulnerabilities": "Vulnerabilities",
    "security_hotspots": "Security Hotspots",
    "sqale_index": "Debt",
    "code_smells": "Code Smells",
    "coverage": "Coverage",
    "duplicated_lines_density": "Duplications"
}

COMPARATOR_MAPPING = {  # Map comparator abbreviations to symbols
    "GT": ">",
    "LT": "<",
    "GE": ">=",
    "LE": "<=",
    "EQ": "=",
    "NE": "!=",  # Add more mappings as needed
}

EXPECTED_OP_MAPPING = {
    ">": "<=",
    "<": ">=",
    ">= ": "<",      # Adjust these as needed, handling edge cases
    "<=": ">",
    "=": "!=",
    "!=": "=",
}

def encode_auth(token):
    auth_string = f"{token}:"
    auth_bytes = auth_string.encode("utf-8")
    return base64.b64encode(auth_bytes).decode("utf-8")

def get_sonar_analysis_results(project_key):
    metrics = [
        "bugs", "vulnerabilities", "security_hotspots", "code_smells",
        "sqale_index", "coverage", "duplicated_lines_density"
    ]
    metric_keys = ",".join(metrics)


    url = f"{SONARQUBE_URL}/api/measures/component?component={project_key}&metricKeys={metric_keys}"
    auth_encoded = encode_auth(SONARQUBE_TOKEN)

    headers = {
        "Accept": "application/json",
        "Authorization": f"Basic {auth_encoded}"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting analysis results: {e}")
        return None

def get_quality_gate_status(project_key):
    url = f"{SONARQUBE_URL}/api/qualitygates/project_status?projectKey={project_key}"
    auth_encoded = encode_auth(SONARQUBE_TOKEN)

    headers = {
        "Accept": "application/json",
        "Authorization": f"Basic {auth_encoded}"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting Quality Gate status: {e}")
        return None

def create_github_comment(analysis_results, project_key):
    global condition, actual_value, operator, error_threshold, comparator
    if not analysis_results or not analysis_results.get("component"):
        return "No SonarQube analysis results found."

    measures = analysis_results["component"].get("measures", [])
    metrics_data = {
        measure["metric"]: measure.get("value", measure.get("period", {}).get("value", "-"))
        for measure in measures
    }

    project_name = analysis_results["component"]["name"]

    quality_gate_data = get_quality_gate_status(project_key)

    if quality_gate_data:
        quality_gate = quality_gate_data.get("projectStatus", {})
        status = quality_gate.get("status", "UNKNOWN")
        conditions = quality_gate.get("conditions", [])
    else:
        status = "UNKNOWN"
        conditions = []

    comment_body = f"## SonarQube Analysis for [{project_name}]({SONARQUBE_URL}/dashboard?id={project_key})\n\n"

    if status == "ERROR":  # Include failure reasons if Quality Gate failed
        failed_conditions = [c for c in conditions if c["status"] == "ERROR"]
        if failed_conditions:
            comment_body += "**Reasons for Failure:**\n"
            for condition in failed_conditions:
                actual_value = condition.get("actualValue", condition.get("period", {}).get("value", "-"))
                comparator = COMPARATOR_MAPPING.get(condition.get("comparator", ""), condition.get("comparator", ""))
                error_threshold = condition.get("errorThreshold", "-")

            expected_operator = EXPECTED_OP_MAPPING.get(comparator, comparator)  # Get expected operator

            comment_body += f"- **{condition['metricKey']}**: {actual_value} {comparator} {error_threshold} (Expected: {expected_operator} {error_threshold})\n\n"

    comment_body += "| Metric | Value |\n"
    comment_body += "|---|---|\n"
    for metric_key, label in METRICS.items():
        value = metrics_data.get(metric_key, "-")
        if metric_key == "sqale_index" and value != "-":
            value = f"{value}min"
        elif metric_key in ("coverage", "duplicated_lines_density") and value != "-":
            value = f"{float(value):.1f}%"
        comment_body += f"| {label} | {value} |\n"

    comment_body += "\n\n### File-Level Issues\n\n"

    issues_url = f"{SONARQUBE_URL}/api/issues/search?componentKeys={project_key}&ps=500"
    auth_encoded = encode_auth(SONARQUBE_TOKEN)
    headers = {
        "Accept": "application/json",
        "Authorization": f"Basic {auth_encoded}"
    }

    try:
        issues_response = requests.get(issues_url, headers=headers)
        issues_response.raise_for_status()
        issues = issues_response.json().get("issues", [])


        for issue_type in ["BUG", "CODE_SMELL", "VULNERABILITY", "SECURITY_HOTSPOT"]:
            type_issues = [issue for issue in issues if issue["type"] == issue_type]
            if type_issues:
                comment_body += f"**{issue_type.replace('_', ' ').title()}s:**\n"
                for issue in type_issues:
                    comment_body += f"- {issue['message']} in *{issue['component']}* ({issue.get('line', '-')})\n"
                comment_body += "\n"

    except requests.exceptions.RequestException as e:
        comment_body += f"Error retrieving file-level issues: {e}\n\n"


    comment_body += f"\n[View detailed analysis in SonarQube]({SONARQUBE_URL}/dashboard?id={project_key})\n"
    return comment_body


def post_github_comment(pr_number, comment_body):
    url = f"https://api.github.com/repos/{GITHUB_REPO_NAME}/issues/{pr_number}/comments"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {"body": comment_body}

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        print(f"Comment posted successfully: {response.json().get('html_url')}")
    except requests.exceptions.RequestException as e:
        print(f"Error posting comment: {e}")

# Example usage
project_key = os.environ.get("SONARQUBE_PROJECT_KEY")
pr_number = int(GITHUB_PR_NUMBER)

analysis_results = get_sonar_analysis_results(project_key)

if analysis_results:
    comment = create_github_comment(analysis_results, project_key)
    post_github_comment(pr_number, comment)
else:
    print("Could not retrieve SonarQube analysis results.")

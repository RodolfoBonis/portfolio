import os

import requests
from github import Github

# Configurações
SONARQUBE_URL = os.environ.get("SONARQUBE_URL")
SONARQUBE_TOKEN = os.environ.get("SONARQUBE_TOKEN")

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_REPO_NAME = os.environ.get("GITHUB_REPO_NAME")
GITHUB_PR_NUMBER = os.environ.get("GITHUB_PR_NUMBER")
PROJECT_KEY = os.environ.get("SONARQUBE_PROJECT_KEY")

# Definição das métricas
METRICS = {
    "bugs": "Bugs",
    "vulnerabilities": "Vulnerabilities",
    "security_hotspots": "Security Hotspots",
    "sqale_index": "Debt",
    "code_smells": "Code Smells",
    "coverage": "Coverage",
    "duplicated_lines_density": "Duplications"
}

# Inicializa o cliente PyGithub
github = Github(GITHUB_TOKEN)
repo = github.get_repo(GITHUB_REPO_NAME)
pr = repo.get_pull(int(GITHUB_PR_NUMBER))

# Função para obter as métricas do SonarQube
def get_sonarqube_metrics(project_key):
    url = f"{SONARQUBE_URL}/api/measures/component"
    params = {
        "component": project_key,
        "metricKeys": ",".join(METRICS.keys())
    }
    auth = (SONARQUBE_TOKEN, "")
    response = requests.get(url, params=params, auth=auth)
    if response.status_code != 200:
        raise Exception(f"Erro ao obter métricas do SonarQube: {response.status_code} - {response.text}")
    return response.json()

# Função para obter o status do Quality Gate
def get_quality_gate_status(project_key):
    url = f"{SONARQUBE_URL}/api/qualitygates/project_status"
    params = {
        "projectKey": project_key
    }

    auth = (SONARQUBE_TOKEN, "")
    response = requests.get(url, params=params, auth=auth)
    if response.status_code != 200:
        raise Exception(f"Erro ao obter status do Quality Gate: {response.status_code} - {response.text}")
    return response.json()

# Função para criar o comentário no GitHub
def create_github_comment(analysis_results, quality_gate_data, project_key):
    if not analysis_results or not analysis_results.get("component"):
        return "No SonarQube analysis results found."

    measures = analysis_results["component"].get("measures", [])
    metrics_data = {
        measure["metric"]: measure.get("value", measure.get("period", {}).get("value", "-"))
        for measure in measures
    }

    project_name = analysis_results["component"]["name"]

    if quality_gate_data:
        quality_gate = quality_gate_data.get("projectStatus", {})
        status = quality_gate.get("status", "UNKNOWN")
        conditions = quality_gate.get("conditions", [])
    else:
        status = "UNKNOWN"
        conditions = []

    comment_body = f"## SonarQube Analysis for [{project_name}]({SONARQUBE_URL}/dashboard?id={project_key})\n\n"

    if status == "ERROR":  # Inclui motivos de falha se o Quality Gate falhar
        failed_conditions = [c for c in conditions if c["status"] == "ERROR"]
        if failed_conditions:
            comment_body += "**Reasons for Failure:**\n"
            for condition in failed_conditions:
                actual_value = condition.get("actualValue", "-")
                comparator = condition.get("comparator", "-")
                error_threshold = condition.get("errorThreshold", "-")
                comment_body += f"- **{condition['metricKey']}**: {actual_value} {comparator} {error_threshold}\n\n"

    comment_body += "| Metric | Value |\n"
    comment_body += "|---|---|\n"
    for metric_key, label in METRICS.items():
        value = metrics_data.get(metric_key, "-")
        if metric_key == "sqale_index" and value != "-":
            value = f"{value}min"
        elif metric_key in ("coverage", "duplicated_lines_density") and value != "-":
            value = f"{float(value):.1f}%"
        comment_body += f"| {label} | {value} |\n"

    comment_body += f"\n[View detailed analysis in SonarQube]({SONARQUBE_URL}/dashboard?id={project_key})\n"
    return comment_body

# Função para postar o comentário no GitHub usando PyGithub
def post_github_comment(pr, comment_body):
    try:
        pr.create_issue_comment(comment_body)
        print("Comment posted successfully!")
    except Exception as e:
        print(f"Error posting comment: {e}")

# Exemplo de uso
try:
    # Busca métricas do projeto usando a API do SonarQube
    analysis_results = get_sonarqube_metrics(PROJECT_KEY)
    quality_gate_data = get_quality_gate_status(PROJECT_KEY)
    if analysis_results:
        comment = create_github_comment(analysis_results, quality_gate_data, PROJECT_KEY)
        post_github_comment(pr, comment)
    else:
        print("Could not retrieve SonarQube analysis results.")
except Exception as e:
    print(f"Error fetching SonarQube data: {e}")

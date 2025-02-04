import os

import openai
from github import Github

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = os.getenv("REPO_NAME")
PR_NUMBER = os.getenv("PR_NUMBER")

openai.api_key = OPENAI_API_KEY
gh = Github(GITHUB_TOKEN)

def generate_description(pr_number, repository):
    pr = repository.get_pull(int(pr_number))
    title = pr.title
    body = pr.body
    files_changed = [f.filename for f in pr.get_files()]
    commits = [c.commit.message for c in pr.get_commits()]

    prompt = f"""
    You're a senior software engineer creating a pull request.
    Generate a detailed description for a GitHub Pull Request.

    **Title:** {title}
    **Body (Existing):** {body or "No existing body content."}
    **Modified files:** {files_changed}
    **Commit Messages:** {commits}

    The description should be concise, clear, and informative for reviewers. Include:
    * Briefly summarize the changes implemented.
    * Explain the context or problem being solved.
    * Provide clear steps for testing the changes.
    * Highlight any potential issues or considerations for reviewers.
    * Use Markdown formatting for readability.

    Format the response in a well-organized and readable way (using markdown).
    """

    try :
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
            ],
            temperature=0.7
        )
        description = response.choices[0].message.content.strip()
        return description
    except Exception as e:
        pr.create_issue_comment(f"An error occurred while generating the description: {e}")
        exit(1)

def update_pr_description(pr_number, new_description):
    repository = gh.get_repo(REPO_NAME)
    pr = repository.get_pull(int(pr_number))
    try:
        pr.edit(body=new_description)
        print(f"Description of PR #{pr_number} updated successfully.")
    except Exception as e:
        pr.create_issue_comment(f"An error occurred while updating the description: {e}")
        exit(1)


if __name__ == "__main__":
    print(f"Generating description for PR #{PR_NUMBER} in {REPO_NAME}...")
    repo = gh.get_repo(REPO_NAME)
    generated_description = generate_description(PR_NUMBER, repo)
    update_pr_description(PR_NUMBER, generated_description)
    print("Description generation and update complete.")

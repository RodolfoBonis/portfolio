import os
import requests
from openai import OpenAI

# Configurações
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
REPO = os.getenv("GITHUB_REPOSITORY")
PR_NUMBER = os.getenv("PR_NUMBER")

# URLs das APIs
GITHUB_API_URL = f"https://api.github.com/repos/{REPO}/pulls/{PR_NUMBER}/files"

client = OpenAI(
  api_key=OPENAI_API_KEY,
)


# Função para obter as alterações do PR
def get_pr_changes():
  headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
  }
  response = requests.get(GITHUB_API_URL, headers=headers)
  if response.status_code != 200:
    raise Exception(f"Erro ao obter alterações do PR: {response.status_code} - {response.text}")
  return response.json()


# Função para enviar as alterações para o GPT-4
def get_gpt4_review(changes):
  changes_text = ""
  for file in changes:
    if "patch" in file:  # Verifica se a chave 'patch' existe
      changes_text += f"Arquivo: {file['filename']}\nAlterações:\n{file['patch']}\n\n"
    else:
      changes_text += f"Arquivo: {file['filename']}\n(Tipo de arquivo não suportado para diff)\n\n"

  if not changes_text.strip():
    return "Nenhuma alteração de código válida para revisão."

  # Prompt para o GPT-4
  prompt = (
    "Por favor, revise as seguintes alterações de código e forneça feedback:\n"
    "1. Identifique possíveis bugs ou problemas de qualidade.\n"
    "2. Sugira melhorias de código.\n"
    "3. Comente sobre a clareza e a organização do código.\n\n"
    f"{changes_text}"
  )

  # Chamada à API da OpenAI (GPT-4)
  response = client.chat.completions.create(
    model="gpt-4",  # Use "gpt-4" ou "gpt-4-turbo" se disponível
    messages=[
      {"role": "system", "content": "Você é um revisor de código experiente."},
      {"role": "user", "content": prompt},
    ],
    max_tokens=1000,  # Ajuste conforme necessário
  )
  return response.choices[0].message.content  # Acesso correto à resposta


# Função para postar o comentário no PR
def post_comment_to_pr(comment):
  headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
  }
  url = f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments"
  payload = {
    "body": comment,
  }
  response = requests.post(url, headers=headers, json=payload)
  if response.status_code != 201:
    raise Exception(f"Erro ao postar comentário no PR: {response.status_code} - {response.text}")


# Função principal
def main():
  try:
    # 1. Obter alterações do PR
    changes = get_pr_changes()
    print("Alterações do PR obtidas com sucesso.")

    # 2. Enviar alterações para o GPT-4
    review = get_gpt4_review(changes)
    print("Revisão do GPT-4 concluída.")

    # 3. Postar o comentário no PR
    comment = f"**Revisão do GPT-4:**\n\n{review}"
    post_comment_to_pr(comment)
    print("Comentário postado no PR com sucesso.")


  except requests.RequestException as req_err:

    print(f"Request error occurred: {req_err}")

  except Exception as e:

    print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
  main()

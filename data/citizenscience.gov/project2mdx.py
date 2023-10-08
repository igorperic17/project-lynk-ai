import requests
import json
import os
import re

# URL of the JSON data
url = "https://www.citizenscience.gov/feed.json"

# Fetch the JSON data from the URL
response = requests.get(url)

try:
    # Try to load JSON data directly
    data = response.json()
except json.JSONDecodeError:
    # If error, try to manually decode and clean the data
    content = response.text
    # Escape invalid characters
    content_cleaned = re.sub(r'[\n\r\t]', '', content)
    try:
        data = json.loads(content_cleaned)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        data = {}

# Extract the project data
projects = data.get('_project', [])

# Destination folder for the MDX files
dest_folder = "mdx_files"
os.makedirs(dest_folder, exist_ok=True)

# Function to convert a project entry to MDX content
def convert_to_mdx(project):
    mdx_content = f"---\n"
    for key, value in project.items():
        mdx_content += f"{key}: {json.dumps(value)}\n"
    mdx_content += f"---\n\n"
    mdx_content += f"# {project.get('project_name', '')}\n\n"
    mdx_content += f"{project.get('project_description', '')}\n"
    return mdx_content

# Convert each project entry to an MDX file
for project in projects:
    project_id = project.get('project_id', 'unknown_id')
    mdx_filename = os.path.join(dest_folder, f"project_{project_id}.mdx")
    with open(mdx_filename, 'w', encoding='utf-8') as mdx_file:
        mdx_file.write(convert_to_mdx(project))

print(f"{len(projects)} MDX files have been created in the '{dest_folder}' folder.")

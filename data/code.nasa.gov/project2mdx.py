import os
import json
import yaml
import requests

# URL to the JSON data
url = 'https://raw.githubusercontent.com/nasa/Open-Source-Catalog/master/code.json'

# Fetch the JSON data from the URL
response = requests.get(url)
data = response.json()

# Extract projects data from the 'releases' key
projects = data['releases']

# Create a directory for the MDX files
output_dir = 'mdx_files'
os.makedirs(output_dir, exist_ok=True)

# Function to create MDX content from project data
def create_mdx_content(project):
    # Convert project data to YAML string and concatenate with MDX content
    mdx_content = "---\n" + yaml.dump(project, default_flow_style=False) + "---\n"
    return mdx_content

# Create and save an MDX file for each project
for i, project in enumerate(projects):
    # Generate a filename using the project name or index if name is not available
    filename = project.get('name', f"project_{i}").replace(" ", "_").replace("/", "-") + ".mdx"
    filepath = os.path.join(output_dir, filename)
    
    # Generate MDX content and write to file
    mdx_content = create_mdx_content(project)
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(mdx_content)

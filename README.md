# Project Lynk AI

  
https://github.com/igorperic17/project-lynk-ai/assets/525557/3f84604a-cf13-4dff-96b8-5e6e59d71b4b



## NASA SpaceApp 2023 Hackaton entry

https://www.spaceappschallenge.org/2023/find-a-team/project-lynk-ai/?tab=project

A full-stack web app in Next.js using to match NASA's open source projects to your open source contributor profile using Large Language Models (self-hosted llama2-7b) and semantic vector embeddings (PostgreSQL on Supabase + pgvector).

## Hi-Res video

https://www.youtube.com/watch?v=1VAAwxxNhuQ

## HIGH-LEVEL SUMMARY


Are you proactive, skillfull and knowledge hungry problem solver? Did you ever want to work on meaningful projects defined by large organisations like NASA, but you didn’t know where to start? Project Lynk AI might be just what you need! It is a marketplace of NASA-related projects available for rapid matching with potential contributors like you! Connect your LinkedIn or GitHub profile, let our advanced AI analyse your skillset and ambitions and match the semantically closest NASA project for you, so your impact is maximised! Work on a project you’re truly passionate about, even where there are mountains of data to choose from. Discover the data lakes you find interesting, match your learning goals with the challenges posed by scientist and engineers around the world and find your place among the stars!



## PROJECT DETAILS


The projects consists of frontend and backend written in [NextJS](https://nextjs.org/) (ReactJS + Tailwind), using PostgreSQL (hosted on [Supabase](https://supabase.com/)) as a relational database storage for indexed NASA projects. [pgvector extension](https://github.com/pgvector/pgvector) is used to store project description embeddings user to match against. Embeddings have initially been created using [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings), and then swapped with a self-hosted [Ollama2 embedding service](https://github.com/jmorganca/ollama/tree/main).

At the moment two of the NASA project sources (code.nasa.gov and citizenscience.gov) are crawled on 8th of October 2023 to generate .mdx files used as a knowledge base. At the deployment time embedding vector are generated for each one of the 1281 + 502 = 1783 NASA projects and stored in PostgreSQL DB as vector embeddings. This list can be expanded at the deployment time using GitHub Actions and committing additional .mdx files to the repository beforehand.

Users providing description of their interests and skills on the main page are converted to the embeddings using the same API and then PostgreSQL is queried to find the most semantically similar projects, which are returned back to the user. User will see the related links for more information and project lead contact info. An expanded description can be interactively generated when previewing the project in case the user has some doubts or needs more information about it. AI is used to facilitate generating this information on the fly directly from the web page.

There is no ability to see the list of all of the project and paginate through them. This is deliberate - we want people to find relevant work to contribute to by truly expressing their interests and desires in a natural way, through language.


## USE OF ARTIFICIAL INTELLIGENCE


OpenAI for generating semantic embeddings and pgvector extension for PostgreSQL for efficient semantic search.


## SPACE AGENCY DATA


[NASA Open Source Software Projects](https://code.nasa.gov/)


[Federal Crowdsourcing and Citizen Science Catalog](https://citizenscience.gov/)

## REFERENCES


[Semantic search tutorial using NextJS and Supabase](https://supabase.com/docs/guides/ai/examples/nextjs-vector-search?database-method=sql)

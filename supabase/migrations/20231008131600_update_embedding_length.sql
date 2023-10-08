-- Migration Script to Alter Vector Embedding Length from 1536 to 4096

-- Step 1: Update the data type of the 'embedding' column in 'nods_page_section' table
ALTER TABLE "public"."nods_page_section"
ALTER COLUMN embedding TYPE vector(4096);

-- Step 2: Update the function parameter and usage
CREATE OR REPLACE FUNCTION match_page_sections(
    embedding vector(4096),  -- Updated embedding vector length
    match_threshold float,
    match_count int,
    min_content_length int
)
RETURNS TABLE (
    id bigint,
    page_id bigint,
    slug text,
    heading text,
    content text,
    similarity float
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_variable
BEGIN
  RETURN QUERY
  SELECT
    nods_page_section.id,
    nods_page_section.page_id,
    nods_page_section.slug,
    nods_page_section.heading,
    nods_page_section.content,
    (nods_page_section.embedding <#> embedding) * -1 AS similarity
  FROM nods_page_section
  WHERE length(nods_page_section.content) >= min_content_length
    AND (nods_page_section.embedding <#> embedding) * -1 > match_threshold
  ORDER BY nods_page_section.embedding <#> embedding
  LIMIT match_count;
END;
$$;

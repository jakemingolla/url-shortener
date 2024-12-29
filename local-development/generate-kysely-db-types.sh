#! /bin/bash

kysely-codegen \
  --dialect postgres \
  --out-file src/db/types.d.ts \
  --schema url_shortener \
  --singular \
  --camel-case

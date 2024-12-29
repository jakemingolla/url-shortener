#! /bin/bash

psql \
  -U postgres \
  -h localhost \
  -p 5432 \
  -d postgres \
  -c "DELETE FROM url_shortener.redirects"

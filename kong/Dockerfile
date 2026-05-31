FROM kong:3.6

USER root

COPY kong.yml /usr/local/kong/declarative/kong.yml

COPY plugins /usr/local/share/lua/5.1

ENV KONG_DATABASE=off
ENV KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml
ENV KONG_PLUGINS=bundled,custom-auth

EXPOSE 8000 8001


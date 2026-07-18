FROM google/cloud-sdk:slim

RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

COPY backup.sh /backup.sh

RUN chmod +x /backup.sh

CMD ["/backup.sh"]
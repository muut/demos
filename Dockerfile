# nodejs
#
# VERSION 0.0.1

# Building from Ubuntu Precise
FROM muut/nodejs_legacy

RUN apt-get -y install build-essential git

EXPOSE 80

ADD ./ /src
ADD supervisord.conf /etc/supervisord.conf

RUN cd /src;npm install -g

CMD ["usr/local/bin/supervisord"]
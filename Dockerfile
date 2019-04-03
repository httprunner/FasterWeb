FROM hub.c.163.com/library/nginx

MAINTAINER yinquanwang

RUN rm /etc/nginx/conf.d/default.conf

RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

ADD default.conf /etc/nginx/conf.d/

COPY dist/  /usr/share/nginx/html/

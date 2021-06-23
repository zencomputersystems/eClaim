FROM steelburn/ionic
COPY . /app/eClaim

WORKDIR /app/eClaim
RUN \
npm install && \
npm install --save \
#    ionic-angular@latest \ 
    @ngx-translate/http-loader@latest \
    crypto-js \
    @types/crypto-js \
    chart.js \
    chart.piecelabel.js \
    xlsx \
    file-saver \
    ngx-pagination \
    file-saver \
    @types/file-saver \
    && \
npm install  --save-dev \
    @angular/tsc-wrapped @ionic/app-scripts@latest && \
npm install @types/chart.js ng2-charts

#updated
EXPOSE 8100 35729
CMD ["sh","/run.sh"]
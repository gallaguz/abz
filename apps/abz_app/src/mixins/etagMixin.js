// src/mixins/etagMixin.js
import axios from '../axios';

export default {
    methods: {
        getETagKey(url) {
            return `etag_${url}`;
        },
        getETag(url) {
            return localStorage.getItem(this.getETagKey(url));
        },
        setETag(url, etag) {
            localStorage.setItem(this.getETagKey(url), etag);
        },
        makeRequest(url, config = {}) {
            const headers = config.headers || {};
            if (this.ifNoneMatch) {
                const etag = this.getETag(url);
                if (etag) {
                    headers['if-none-match'] = etag;
                }
            }
            return axios.get(url, { ...config, headers }).then(response => {
                if (response.status === 200 && response.headers.etag) {
                    this.setETag(url, response.headers.etag);
                }
                return response;
            });
        }
    }
};

import * as http from "superagent";

describe('Version', () => {

    const host = process.env['API_BASE_URL'];
    const imageVersion = process.env['IMAGE_VERSION'];

    it('should have correct version',  () => {

        return http.get(`${host}/v1/version`).then(res => {
            const vi = JSON.parse(res.text);
            expect(res.status).toBe(200);
            expect(vi.version).toBe(imageVersion)
        });
    });

});
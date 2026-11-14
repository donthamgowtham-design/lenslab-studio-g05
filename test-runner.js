// test-runner.js
// Member 5: Automated Verification Script for Client Twist Rules & Core Requirements

const http = require('http');
const { app, startServer } = require('./server');
const seed = require('./database/seed');

function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
            });
        });

        req.on('error', (err) => reject(err));
        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

async function runTests() {
    console.log('\n=============================================================');
    console.log('         LENSLAB STUDIO - AUTOMATED TEST SUITE               ');
    console.log('=============================================================');

    // 1. Reset Database
    await seed();

    // 2. Start Server
    const server = await startServer();
    let passedCount = 0;
    let failedCount = 0;

    function assert(testName, condition, actualInfo) {
        if (condition) {
            console.log(`[PASS] ${testName} -> ${JSON.stringify(actualInfo)}`);
            passedCount++;
        } else {
            console.error(`[FAIL] ${testName} -> ${JSON.stringify(actualInfo)}`);
            failedCount++;
        }
    }

    try {
        console.log('\n--- VERIFYING YOUR TWIST: NO DUPLICATE NAMES ---');

        // Test 1: Add Camera 3 -> 201
        const t1 = await makeRequest('POST', '/cameras', { name: 'Camera 3', kind: 'Mirrorless' });
        assert('Test 1: Add Camera 3 -> Expect 201', t1.statusCode === 201, {
            status: t1.statusCode,
            body: t1.body
        });

        // Test 2: Add "camera 3" (different casing) -> 409 and message "Camera 3 already exists"
        const t2 = await makeRequest('POST', '/cameras', { name: 'camera 3', kind: 'DSLR' });
        const t2MsgMatches = t2.body && (t2.body.message === 'Camera 3 already exists' || t2.body.error === 'Camera 3 already exists');
        assert('Test 2: Add "camera 3" -> Expect 409 & "Camera 3 already exists"', t2.statusCode === 409 && t2MsgMatches, {
            status: t2.statusCode,
            body: t2.body
        });

        // Test 3: Rename another to the same name -> 409
        // Camera with ID 2 is "Sony Alpha A7 IV". Attempting to rename it to "CAMERA 3" should fail with 409
        const t3 = await makeRequest('PUT', '/cameras/2', { name: 'CAMERA 3', kind: 'Mirrorless' });
        assert('Test 3: Rename another to the same name -> Expect 409', t3.statusCode === 409, {
            status: t3.statusCode,
            body: t3.body
        });

        console.log('\n--- VERIFYING CORE REQUIREMENTS ---');

        // Test 4: Validation on add (missing kind) -> 400
        const t4 = await makeRequest('POST', '/cameras', { name: 'GoPro Hero 12' });
        assert('Test 4: Validation missing fields -> Expect 400', t4.statusCode === 400, {
            status: t4.statusCode,
            body: t4.body
        });

        // Test 5: Search by query parameter (?kind=Mirrorless) -> 200
        const t5 = await makeRequest('GET', '/cameras?kind=Mirrorless');
        assert('Test 5: Query parameter search (?kind=Mirrorless) -> Expect 200', t5.statusCode === 200 && Array.isArray(t5.body), {
            status: t5.statusCode,
            count: Array.isArray(t5.body) ? t5.body.length : 0
        });

        // Test 6: One Join Endpoint (/rentals) -> rentals with photographer name and camera name
        const t6 = await makeRequest('GET', '/rentals');
        const hasJoinFields = Array.isArray(t6.body) && t6.body.length > 0 &&
                              t6.body[0].photographer_name && t6.body[0].camera_name;
        assert('Test 6: Join endpoint (/rentals) -> Expect 200 with photographer_name & camera_name', t6.statusCode === 200 && hasJoinFields, {
            status: t6.statusCode,
            sampleRecord: t6.body[0]
        });

        // Test 7: Get One Camera (GET /cameras/1) -> 200
        const t7 = await makeRequest('GET', '/cameras/1');
        assert('Test 7: Get one camera (GET /cameras/1) -> Expect 200', t7.statusCode === 200 && t7.body.id === 1, {
            status: t7.statusCode,
            camera: t7.body
        });

        // Test 8: Update Camera (PUT /cameras/2 with valid new name) -> 200
        const t8 = await makeRequest('PUT', '/cameras/2', { name: 'Sony FX3 Cinema', kind: 'Cinema' });
        assert('Test 8: Update camera -> Expect 200', t8.statusCode === 200, {
            status: t8.statusCode,
            body: t8.body
        });

        // Test 9: Delete Camera (DELETE /cameras/4) -> 200
        const t9 = await makeRequest('DELETE', '/cameras/4');
        assert('Test 9: Delete camera -> Expect 200', t9.statusCode === 200, {
            status: t9.statusCode,
            body: t9.body
        });

        console.log('\n=============================================================');
        console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
        console.log('=============================================================\n');

    } catch (err) {
        console.error('Test execution error:', err);
    } finally {
        server.close(() => {
            console.log('Test server shut down successfully.');
            process.exit(failedCount === 0 ? 0 : 1);
        });
    }
}

if (require.main === module) {
    runTests();
}

module.exports = { runTests };

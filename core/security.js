const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class AVSSecurity {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    generateNodeCredentials() {
        const nodeId = crypto.randomBytes(16).toString('hex');
        const accessToken = jwt.sign({ nodeId }, this.secretKey, { expiresIn: '24h' });
        return { nodeId, accessToken };
    }

    validateRequest(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            throw new Error('Invalid authentication token');
        }
    }

    encryptData(data) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(this.secretKey), iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { encrypted, iv: iv.toString('hex') };
    }

    decryptData(encryptedData, iv) {
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(this.secretKey), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
}

module.exports = AVSSecurity;
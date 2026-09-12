import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || (() => {
  console.error("CRITICAL: ENCRYPTION_KEY environment variable is required for banking data security");
  process.exit(1);
})();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM standard IV length is 12 bytes
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Encrypts sensitive banking data using AES-256-GCM
 */
export function encryptBankingData(text: string): string {
  if (!text) return '';
  
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(12); // GCM standard IV length is 12 bytes
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 10000, 32, 'sha256');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return salt.toString('hex') + iv.toString('hex') + tag.toString('hex') + encrypted;
}

/**
 * Decrypts sensitive banking data using AES-256-GCM
 */
export function decryptBankingData(encryptedText: string): string {
  if (!encryptedText) return '';
  
  try {
    const salt = Buffer.from(encryptedText.slice(0, SALT_LENGTH * 2), 'hex');
    const iv = Buffer.from(encryptedText.slice(SALT_LENGTH * 2, TAG_POSITION * 2), 'hex');
    const tag = Buffer.from(encryptedText.slice(TAG_POSITION * 2, ENCRYPTED_POSITION * 2), 'hex');
    const encrypted = encryptedText.slice(ENCRYPTED_POSITION * 2);
    
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 10000, 32, 'sha256');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt banking data');
  }
}

/**
 * Safely encrypts banking fields in user data before database storage
 */
export function encryptUserBankingData(userData: any) {
  const encrypted = { ...userData };
  
  if (userData.bankAccountNumber) {
    encrypted.bankAccountNumber = encryptBankingData(userData.bankAccountNumber);
  }
  
  if (userData.bankIfsc) {
    encrypted.bankIfsc = encryptBankingData(userData.bankIfsc);
  }
  
  if (userData.gstNumber) {
    encrypted.gstNumber = encryptBankingData(userData.gstNumber);
  }
  
  if (userData.upiId) {
    encrypted.upiId = encryptBankingData(userData.upiId);
  }
  
  return encrypted;
}

/**
 * Safely decrypts banking fields for authorized access only
 */
export function decryptUserBankingData(userData: any) {
  const decrypted = { ...userData };
  
  try {
    if (userData.bankAccountNumber) {
      decrypted.bankAccountNumber = decryptBankingData(userData.bankAccountNumber);
    }
    
    if (userData.bankIfsc) {
      decrypted.bankIfsc = decryptBankingData(userData.bankIfsc);
    }
    
    if (userData.gstNumber) {
      decrypted.gstNumber = decryptBankingData(userData.gstNumber);
    }
    
    if (userData.upiId) {
      decrypted.upiId = decryptBankingData(userData.upiId);
    }
  } catch (error) {
    console.error('Error decrypting user banking data:', error);
    // Return original data without banking fields if decryption fails
    const { bankAccountNumber, bankIfsc, gstNumber, upiId, ...safeData } = userData;
    return safeData;
  }
  
  return decrypted;
}

/**
 * Creates a sanitized version of user data without sensitive banking information
 * Use this for API responses to prevent accidental exposure
 */
export function sanitizeUserData(userData: any) {
  const { 
    bankAccountNumber, 
    bankIfsc, 
    gstNumber, 
    upiId, 
    password,
    resetToken,
    resetTokenExpiry,
    ...sanitizedData 
  } = userData;
  
  return sanitizedData;
}
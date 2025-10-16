/**
 * Generate a random password with customizable length, character sets, and complexity
 * 
 * @param {Object} params - Password generation parameters
 * @param {number} [params.length=12] - Password length (default: 12)
 * @param {boolean} [params.uppercase=true] - Include uppercase letters
 * @param {boolean} [params.lowercase=true] - Include lowercase letters
 * @param {boolean} [params.numbers=true] - Include numbers
 * @param {boolean} [params.special_chars=true] - Include special characters
 * 
 * @returns {Promise<Object>} - Password generation result
 */
export async function generate_password(params: {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  special_chars?: boolean;
}): Promise<{
  success: boolean;
  data: string | null;
  error?: string;
}> {
  try {
    const length = params.length ?? 12;
    if (length < 8) {
      throw new Error('Password length must be at least 8 characters');
    }

    const charSets: string[] = [];
    if (params.uppercase !== false) charSets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (params.lowercase !== false) charSets.push('abcdefghijklmnopqrstuvwxyz');
    if (params.numbers !== false) charSets.push('0123456789');
    if (params.special_chars !== false) charSets.push('!@#$%^&*()_+~`|}{[]:;?><,./-=');

    if (charSets.length === 0) {
      throw new Error('At least one character set must be selected');
    }

    const chars = charSets.join('');
    const password: string[] = [];

    for (let i = 0; i < length; i++) {
      const charIndex = Math.floor(Math.random() * chars.length);
      password.push(chars[charIndex]);
    }

    return {
      success: true,
      data: password.join(''),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
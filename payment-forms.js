// Payment Form System - Credit Card, PayPal, and other payment methods
// Handles secure payment information collection and processing

class PaymentFormManager {
    constructor() {
        this.paymentMethods = {
            credit_card: {
                name: 'Credit Card',
                icon: '💳',
                description: 'Visa, Mastercard, American Express',
                fields: ['cardNumber', 'expiryDate', 'cvv', 'cardholderName', 'billingAddress']
            },
            paypal: {
                name: 'PayPal',
                icon: '🅿️',
                description: 'Pay with your PayPal account',
                fields: ['paypalEmail']
            },
            bank_transfer: {
                name: 'Bank Transfer',
                icon: '🏦',
                description: 'Direct bank account transfer',
                fields: ['routingNumber', 'accountNumber', 'accountType']
            },
            crypto: {
                name: 'Cryptocurrency',
                icon: '₿',
                description: 'Bitcoin, Ethereum, USDC',
                fields: ['walletAddress', 'cryptoType']
            }
        };
    }

    // Generate payment method selection
    generatePaymentMethodSelection() {
        return `
            <div class="glass rounded-xl p-6 mb-6">
                <h3 class="text-xl font-bold mb-4">
                    <i class="fas fa-credit-card text-blue-400 mr-2"></i>Add Payment Method
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    ${Object.entries(this.paymentMethods).map(([id, method]) => `
                        <div class="payment-method-option p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors" data-method="${id}">
                            <div class="flex items-center mb-2">
                                <span class="text-2xl mr-3">${method.icon}</span>
                                <div>
                                    <div class="font-medium">${method.name}</div>
                                    <div class="text-sm text-gray-400">${method.description}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div id="paymentFormContainer" class="hidden">
                    <!-- Payment forms will be inserted here -->
                </div>
            </div>
        `;
    }

    // Generate credit card form
    generateCreditCardForm() {
        return `
            <div class="space-y-4">
                <h4 class="text-lg font-medium mb-4">💳 Credit Card Information</h4>
                
                <!-- Card Number -->
                <div>
                    <label class="block text-sm font-medium mb-2">Card Number *</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19"
                           class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <div class="flex mt-2 space-x-2">
                        <img src="https://img.icons8.com/color/24/000000/visa.png" alt="Visa">
                        <img src="https://img.icons8.com/color/24/000000/mastercard.png" alt="Mastercard">
                        <img src="https://img.icons8.com/color/24/000000/american-express.png" alt="Amex">
                    </div>
                </div>

                <!-- Cardholder Name -->
                <div>
                    <label class="block text-sm font-medium mb-2">Cardholder Name *</label>
                    <input type="text" id="cardholderName" placeholder="John Doe"
                           class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Expiry and CVV -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Expiry Date *</label>
                        <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5"
                               class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">CVV *</label>
                        <input type="text" id="cvv" placeholder="123" maxlength="4"
                               class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <!-- Billing Address -->
                <div class="border-t border-gray-700 pt-4">
                    <h5 class="font-medium mb-3">Billing Address</h5>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-2">Address *</label>
                            <input type="text" id="billingAddress" placeholder="123 Main St"
                                   class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">City *</label>
                                <input type="text" id="billingCity" placeholder="New York"
                                       class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">State *</label>
                                <input type="text" id="billingState" placeholder="NY"
                                       class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">ZIP Code *</label>
                                <input type="text" id="billingZip" placeholder="10001"
                                       class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Country *</label>
                                <select id="billingCountry" class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Security Notice -->
                <div class="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-shield-alt text-blue-400 mr-3 mt-1"></i>
                        <div class="text-sm text-gray-300">
                            <div class="font-medium mb-1">Secure Payment</div>
                            <div>Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.</div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <button id="saveCreditCardBtn" class="btn bg-gradient-primary hover:opacity-90 w-full py-3">
                    <i class="fas fa-credit-card mr-2"></i>Save Credit Card
                </button>
            </div>
        `;
    }

    // Generate PayPal form
    generatePayPalForm() {
        return `
            <div class="space-y-4">
                <h4 class="text-lg font-medium mb-4">🅿️ PayPal Account</h4>
                
                <!-- PayPal Email -->
                <div>
                    <label class="block text-sm font-medium mb-2">PayPal Email Address *</label>
                    <input type="email" id="paypalEmail" placeholder="your.email@example.com"
                           class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- PayPal Info -->
                <div class="bg-yellow-900 bg-opacity-30 p-4 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-yellow-400 mr-3 mt-1"></i>
                        <div class="text-sm text-gray-300">
                            <div class="font-medium mb-1">PayPal Integration</div>
                            <div>We'll redirect you to PayPal to securely log in and authorize payments. No need to share your PayPal password.</div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <button id="savePayPalBtn" class="btn bg-gradient-primary hover:opacity-90 w-full py-3">
                    <i class="fas fa-paypal mr-2"></i>Link PayPal Account
                </button>
            </div>
        `;
    }

    // Generate bank transfer form
    generateBankTransferForm() {
        return `
            <div class="space-y-4">
                <h4 class="text-lg font-medium mb-4">🏦 Bank Account Information</h4>
                
                <!-- Account Type -->
                <div>
                    <label class="block text-sm font-medium mb-2">Account Type *</label>
                    <select id="accountType" class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Account Type</option>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                    </select>
                </div>

                <!-- Routing Number -->
                <div>
                    <label class="block text-sm font-medium mb-2">Routing Number *</label>
                    <input type="text" id="routingNumber" placeholder="123456789" maxlength="9"
                           class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Account Number -->
                <div>
                    <label class="block text-sm font-medium mb-2">Account Number *</label>
                    <input type="text" id="accountNumber" placeholder="Account Number"
                           class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Security Notice -->
                <div class="bg-green-900 bg-opacity-30 p-4 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-shield-alt text-green-400 mr-3 mt-1"></i>
                        <div class="text-sm text-gray-300">
                            <div class="font-medium mb-1">Secure Bank Transfer</div>
                            <div>Bank transfers are processed securely through our banking partners. Your account information is encrypted.</div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <button id="saveBankBtn" class="btn bg-gradient-primary hover:opacity-90 w-full py-3">
                    <i class="fas fa-university mr-2"></i>Save Bank Account
                </button>
            </div>
        `;
    }

    // Generate cryptocurrency form
    generateCryptoForm() {
        return `
            <div class="space-y-4">
                <h4 class="text-lg font-medium mb-4">₿ Cryptocurrency Wallet</h4>
                
                <!-- Crypto Type -->
                <div>
                    <label class="block text-sm font-medium mb-2">Cryptocurrency *</label>
                    <select id="cryptoType" class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Cryptocurrency</option>
                        <option value="bitcoin">Bitcoin (BTC)</option>
                        <option value="ethereum">Ethereum (ETH)</option>
                        <option value="usdc">USD Coin (USDC)</option>
                        <option value="litecoin">Litecoin (LTC)</option>
                    </select>
                </div>

                <!-- Wallet Address -->
                <div>
                    <label class="block text-sm font-medium mb-2">Wallet Address *</label>
                    <input type="text" id="walletAddress" placeholder="Enter your wallet address"
                           class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Crypto Info -->
                <div class="bg-orange-900 bg-opacity-30 p-4 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-orange-400 mr-3 mt-1"></i>
                        <div class="text-sm text-gray-300">
                            <div class="font-medium mb-1">Important Notice</div>
                            <div>Cryptocurrency transactions are irreversible. Double-check your wallet address before confirming.</div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <button id="saveCryptoBtn" class="btn bg-gradient-primary hover:opacity-90 w-full py-3">
                    <i class="fas fa-coins mr-2"></i>Save Crypto Wallet
                </button>
            </div>
        `;
    }

    // Validate credit card number (Luhn algorithm)
    validateCreditCard(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(cleaned)) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    // Format card number with spaces
    formatCardNumber(value) {
        const cleaned = value.replace(/\s/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    }

    // Format expiry date
    formatExpiryDate(value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    }

    // Get saved payment methods
    getSavedPaymentMethods() {
        return `
            <div class="glass rounded-xl p-6 mb-6">
                <h3 class="text-xl font-bold mb-4">
                    <i class="fas fa-credit-card text-blue-400 mr-2"></i>Saved Payment Methods
                </h3>
                
                <div id="savedPaymentMethods" class="space-y-3">
                    <!-- Payment methods will be loaded here -->
                </div>

                <button id="addPaymentMethodBtn" class="btn bg-gradient-primary hover:opacity-90 w-full py-3 mt-4">
                    <i class="fas fa-plus mr-2"></i>Add New Payment Method
                </button>
            </div>
        `;
    }
}

module.exports = PaymentFormManager;

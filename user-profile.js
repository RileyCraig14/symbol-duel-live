// User Profile Management System
// Handles user registration, profile setup, and account verification

class UserProfileManager {
    constructor() {
        this.requiredFields = [
            'firstName',
            'lastName', 
            'email',
            'dateOfBirth',
            'phoneNumber',
            'address',
            'city',
            'state',
            'zipCode',
            'country'
        ];
        
        this.verificationStatus = {
            email: false,
            phone: false,
            identity: false,
            address: false
        };
    }

    // Validate user profile completeness
    validateProfile(userData) {
        const missing = this.requiredFields.filter(field => !userData[field]);
        return {
            valid: missing.length === 0,
            missing: missing,
            completeness: Math.round(((this.requiredFields.length - missing.length) / this.requiredFields.length) * 100)
        };
    }

    // Generate profile completion steps
    getProfileSteps(userData) {
        const steps = [
            {
                id: 'personal',
                title: 'Personal Information',
                description: 'Basic personal details',
                fields: ['firstName', 'lastName', 'email'],
                completed: ['firstName', 'lastName', 'email'].every(field => userData[field]),
                icon: '👤'
            },
            {
                id: 'verification',
                title: 'Age Verification',
                description: 'Verify you are 18+ years old',
                fields: ['dateOfBirth'],
                completed: userData.dateOfBirth && this.verifyAge(userData.dateOfBirth),
                icon: '🎂'
            },
            {
                id: 'contact',
                title: 'Contact Information',
                description: 'Phone and address details',
                fields: ['phoneNumber', 'address', 'city', 'state', 'zipCode', 'country'],
                completed: ['phoneNumber', 'address', 'city', 'state', 'zipCode', 'country'].every(field => userData[field]),
                icon: '📞'
            },
            {
                id: 'payment',
                title: 'Payment Method',
                description: 'Add a payment method for deposits',
                fields: ['paymentMethod'],
                completed: userData.paymentMethod,
                icon: '💳'
            },
            {
                id: 'terms',
                title: 'Terms & Conditions',
                description: 'Accept terms and privacy policy',
                fields: ['termsAccepted', 'privacyAccepted'],
                completed: userData.termsAccepted && userData.privacyAccepted,
                icon: '📋'
            }
        ];

        return steps;
    }

    // Verify user age
    verifyAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    }

    // Format user data for display
    formatUserData(userData) {
        return {
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            email: userData.email || '',
            age: userData.dateOfBirth ? this.calculateAge(userData.dateOfBirth) : null,
            location: this.formatLocation(userData),
            verification: this.getVerificationStatus(userData)
        };
    }

    // Calculate age from date of birth
    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }
        return age;
    }

    // Format location string
    formatLocation(userData) {
        if (userData.city && userData.state) {
            return `${userData.city}, ${userData.state}`;
        } else if (userData.city) {
            return userData.city;
        } else if (userData.country) {
            return userData.country;
        }
        return 'Not provided';
    }

    // Get verification status
    getVerificationStatus(userData) {
        return {
            email: !!userData.email,
            age: this.verifyAge(userData.dateOfBirth),
            phone: !!userData.phoneNumber,
            address: !!(userData.address && userData.city && userData.state)
        };
    }

    // Generate profile setup HTML
    generateProfileSetupHTML(userData = {}) {
        const steps = this.getProfileSteps(userData);
        const currentStep = steps.find(step => !step.completed) || steps[steps.length - 1];

        return `
            <div class="glass rounded-xl p-6 mb-6">
                <h3 class="text-xl font-bold mb-4">
                    <i class="fas fa-user-circle text-blue-400 mr-2"></i>Complete Your Profile
                </h3>
                
                <!-- Progress Bar -->
                <div class="mb-6">
                    <div class="flex justify-between text-sm mb-2">
                        <span>Profile Completion</span>
                        <span>${Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                             style="width: ${Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%"></div>
                    </div>
                </div>

                <!-- Profile Steps -->
                <div class="space-y-4">
                    ${steps.map(step => `
                        <div class="flex items-center p-3 rounded-lg ${step.completed ? 'bg-green-900 bg-opacity-30' : step.id === currentStep.id ? 'bg-blue-900 bg-opacity-30' : 'bg-gray-800 bg-opacity-30'}">
                            <div class="text-2xl mr-3">${step.icon}</div>
                            <div class="flex-1">
                                <div class="font-medium ${step.completed ? 'text-green-400' : step.id === currentStep.id ? 'text-blue-400' : 'text-gray-400'}">
                                    ${step.title}
                                    ${step.completed ? '<i class="fas fa-check text-green-400 ml-2"></i>' : ''}
                                </div>
                                <div class="text-sm text-gray-400">${step.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Setup Button -->
                <div class="mt-6">
                    <button id="setupProfileBtn" class="btn bg-gradient-primary hover:opacity-90 w-full py-3">
                        <i class="fas fa-user-edit mr-2"></i>
                        ${steps.every(s => s.completed) ? 'Update Profile' : 'Complete Profile Setup'}
                    </button>
                </div>
            </div>
        `;
    }

    // Generate profile form HTML
    generateProfileFormHTML(userData = {}) {
        return `
            <div class="glass rounded-xl p-6 mb-6">
                <h3 class="text-xl font-bold mb-4">
                    <i class="fas fa-user-edit text-blue-400 mr-2"></i>Profile Information
                </h3>
                
                <form id="profileForm" class="space-y-4">
                    <!-- Personal Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">First Name *</label>
                            <input type="text" name="firstName" value="${userData.firstName || ''}" 
                                   class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Last Name *</label>
                            <input type="text" name="lastName" value="${userData.lastName || ''}" 
                                   class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Email Address *</label>
                        <input type="email" name="email" value="${userData.email || ''}" 
                               class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               required>
                    </div>

                    <!-- Date of Birth -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Date of Birth * (Must be 18+)</label>
                        <input type="date" name="dateOfBirth" value="${userData.dateOfBirth || ''}" 
                               class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               required>
                    </div>

                    <!-- Phone Number -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Phone Number *</label>
                        <input type="tel" name="phoneNumber" value="${userData.phoneNumber || ''}" 
                               class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="(555) 123-4567" required>
                    </div>

                    <!-- Address -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Street Address *</label>
                        <input type="text" name="address" value="${userData.address || ''}" 
                               class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               required>
                    </div>

                    <!-- City, State, Zip -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">City *</label>
                            <input type="text" name="city" value="${userData.city || ''}" 
                                   class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">State *</label>
                            <input type="text" name="state" value="${userData.state || ''}" 
                                   class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">ZIP Code *</label>
                            <input type="text" name="zipCode" value="${userData.zipCode || ''}" 
                                   class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   required>
                        </div>
                    </div>

                    <!-- Country -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Country *</label>
                        <select name="country" class="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            <option value="">Select Country</option>
                            <option value="US" ${userData.country === 'US' ? 'selected' : ''}>United States</option>
                            <option value="CA" ${userData.country === 'CA' ? 'selected' : ''}>Canada</option>
                            <option value="GB" ${userData.country === 'GB' ? 'selected' : ''}>United Kingdom</option>
                            <option value="AU" ${userData.country === 'AU' ? 'selected' : ''}>Australia</option>
                            <option value="DE" ${userData.country === 'DE' ? 'selected' : ''}>Germany</option>
                            <option value="FR" ${userData.country === 'FR' ? 'selected' : ''}>France</option>
                            <option value="ES" ${userData.country === 'ES' ? 'selected' : ''}>Spain</option>
                            <option value="IT" ${userData.country === 'IT' ? 'selected' : ''}>Italy</option>
                            <option value="NL" ${userData.country === 'NL' ? 'selected' : ''}>Netherlands</option>
                            <option value="SE" ${userData.country === 'SE' ? 'selected' : ''}>Sweden</option>
                        </select>
                    </div>

                    <!-- Terms and Conditions -->
                    <div class="space-y-3 pt-4 border-t border-gray-700">
                        <div class="flex items-start">
                            <input type="checkbox" name="termsAccepted" ${userData.termsAccepted ? 'checked' : ''} 
                                   class="mt-1 mr-3" required>
                            <label class="text-sm text-gray-300">
                                I agree to the <a href="#" class="text-blue-400 hover:underline">Terms of Service</a> and 
                                <a href="#" class="text-blue-400 hover:underline">User Agreement</a> *
                            </label>
                        </div>
                        <div class="flex items-start">
                            <input type="checkbox" name="privacyAccepted" ${userData.privacyAccepted ? 'checked' : ''} 
                                   class="mt-1 mr-3" required>
                            <label class="text-sm text-gray-300">
                                I agree to the <a href="#" class="text-blue-400 hover:underline">Privacy Policy</a> and 
                                data processing for age verification and compliance *
                            </label>
                        </div>
                        <div class="flex items-start">
                            <input type="checkbox" name="ageVerified" ${userData.ageVerified ? 'checked' : ''} 
                                   class="mt-1 mr-3" required>
                            <label class="text-sm text-gray-300">
                                I confirm that I am 18 years of age or older and legally eligible to participate *
                            </label>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="pt-4">
                        <button type="submit" class="btn bg-gradient-primary hover:opacity-90 w-full py-3">
                            <i class="fas fa-save mr-2"></i>Save Profile
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
}

module.exports = UserProfileManager;

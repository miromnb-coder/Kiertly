import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

type AuthMode = 'signUp' | 'signIn';

type KiertlyEmailAuthScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function KiertlyEmailAuthScreen({ onBack, onContinue }: KiertlyEmailAuthScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signUp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isSignUp = authMode === 'signUp';

  function clearError() {
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  function changeAuthMode(nextMode: AuthMode) {
    setAuthMode(nextMode);
    setErrorMessage('');
  }

  function validateAndContinue() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Lisää sähköposti.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Kirjoita toimiva sähköpostiosoite.');
      return;
    }

    if (!password) {
      setErrorMessage('Lisää salasana.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Salasanan pitää olla vähintään 6 merkkiä.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage('Salasanat eivät täsmää.');
      return;
    }

    if (isSignUp && !hasAcceptedTerms) {
      setErrorMessage('Hyväksy käyttöehdot jatkaaksesi.');
      return;
    }

    setErrorMessage('');
    onContinue();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Takaisin"
            onPress={onBack}
            hitSlop={12}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={29} color={theme.colors.text} strokeWidth={1.8} />
          </Pressable>

          <View style={styles.brandWrap}>
            <Text style={styles.smallBrand}>Kiertly</Text>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>{isSignUp ? 'Luo tili' : 'Kirjaudu sisään'}</Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Aloita luomalla tili sähköpostilla.'
                : 'Jatka kirjautumalla sähköpostilla.'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Feather name="mail" size={22} color={theme.colors.mutedText} strokeWidth={1.8} />
              <TextInput
                value={email}
                onChangeText={(nextEmail) => {
                  setEmail(nextEmail);
                  clearError();
                }}
                placeholder="Sähköposti"
                placeholderTextColor={theme.colors.mutedText}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrap}>
              <Feather name="lock" size={22} color={theme.colors.mutedText} strokeWidth={1.8} />
              <TextInput
                value={password}
                onChangeText={(nextPassword) => {
                  setPassword(nextPassword);
                  clearError();
                }}
                placeholder="Salasana"
                placeholderTextColor={theme.colors.mutedText}
                secureTextEntry={!isPasswordVisible}
                textContentType="password"
                style={styles.input}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isPasswordVisible ? 'Piilota salasana' : 'Näytä salasana'}
                onPress={() => setIsPasswordVisible((currentValue) => !currentValue)}
                hitSlop={10}
              >
                <Feather
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={22}
                  color={theme.colors.mutedText}
                  strokeWidth={1.8}
                />
              </Pressable>
            </View>

            {isSignUp ? (
              <View style={styles.inputWrap}>
                <Feather name="lock" size={22} color={theme.colors.mutedText} strokeWidth={1.8} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={(nextConfirmPassword) => {
                    setConfirmPassword(nextConfirmPassword);
                    clearError();
                  }}
                  placeholder="Vahvista salasana"
                  placeholderTextColor={theme.colors.mutedText}
                  secureTextEntry={!isConfirmPasswordVisible}
                  textContentType="password"
                  style={styles.input}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={isConfirmPasswordVisible ? 'Piilota salasana' : 'Näytä salasana'}
                  onPress={() => setIsConfirmPasswordVisible((currentValue) => !currentValue)}
                  hitSlop={10}
                >
                  <Feather
                    name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                    size={22}
                    color={theme.colors.mutedText}
                    strokeWidth={1.8}
                  />
                </Pressable>
              </View>
            ) : null}

            {isSignUp ? (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: hasAcceptedTerms }}
                onPress={() => {
                  setHasAcceptedTerms((currentValue) => !currentValue);
                  clearError();
                }}
                style={styles.termsRow}
              >
                <View style={[styles.checkbox, hasAcceptedTerms && styles.checkboxChecked]}>
                  {hasAcceptedTerms ? (
                    <Feather name="check" size={15} color={theme.colors.white} strokeWidth={2.4} />
                  ) : null}
                </View>
                <Text style={styles.termsText}>
                  Hyväksyn <Text style={styles.termsLink}>käyttöehdot</Text>
                </Text>
              </Pressable>
            ) : null}

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={17} color="#A14C3A" strokeWidth={2} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Pressable accessibilityRole="button" onPress={validateAndContinue} style={styles.continueButton}>
              <Text style={styles.continueText}>{isSignUp ? 'Jatka' : 'Kirjaudu'}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => changeAuthMode(isSignUp ? 'signIn' : 'signUp')}
              hitSlop={12}
              style={styles.loginLinkWrap}
            >
              <Text style={styles.loginText}>
                {isSignUp ? 'Onko sinulla jo tili? ' : 'Ei vielä tiliä? '}
                <Text style={styles.loginLink}>{isSignUp ? 'Kirjaudu' : 'Luo tili'}</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 14,
    paddingBottom: 22,
  },
  backButton: {
    width: 44,
    height: 38,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  brandWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
  smallBrand: {
    color: '#405032',
    fontFamily: 'Georgia',
    fontSize: 25,
    fontWeight: '600',
  },
  titleWrap: {
    marginTop: 52,
    marginBottom: 34,
  },
  title: {
    color: '#405032',
    fontFamily: 'Georgia',
    fontSize: 39,
    fontWeight: '600',
    letterSpacing: -0.7,
    lineHeight: 44,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 14,
    color: theme.colors.mutedText,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputWrap: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
    paddingHorizontal: 22,
    borderWidth: 1.2,
    borderColor: '#6D775E',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  checkbox: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.7,
    borderColor: theme.colors.mutedText,
    borderRadius: 6,
  },
  checkboxChecked: {
    borderColor: '#405032',
    backgroundColor: '#405032',
  },
  termsText: {
    color: theme.colors.mutedText,
    fontSize: 15,
    fontWeight: '500',
  },
  termsLink: {
    color: '#405032',
    fontWeight: '800',
  },
  errorBox: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E3C7BE',
    borderRadius: 12,
    backgroundColor: '#F3E9E4',
  },
  errorText: {
    flex: 1,
    color: '#A14C3A',
    fontSize: 13,
    fontWeight: '700',
  },
  continueButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#405032',
  },
  continueText: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  loginLinkWrap: {
    alignItems: 'center',
    marginTop: 22,
  },
  loginText: {
    color: theme.colors.mutedText,
    fontSize: 16,
    fontWeight: '500',
  },
  loginLink: {
    color: '#405032',
    fontWeight: '800',
  },
});

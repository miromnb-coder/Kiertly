import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

type AuthMode = 'signUp' | 'signIn';

type KiertlyEmailAuthScreenProps = {
  onBack: () => void;
  onAuthenticated: () => void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getAuthErrorMessage(message?: string) {
  if (!message) {
    return 'Jokin meni pieleen. Yritä uudelleen.';
  }

  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('invalid login credentials')) {
    return 'Sähköposti tai salasana on väärin.';
  }

  if (normalizedMessage.includes('email not confirmed')) {
    return 'Vahvista sähköposti ennen kirjautumista.';
  }

  if (normalizedMessage.includes('user already registered') || normalizedMessage.includes('already registered')) {
    return 'Tällä sähköpostilla on jo tili. Kokeile kirjautua sisään.';
  }

  if (normalizedMessage.includes('password')) {
    return 'Salasana ei kelpaa. Kokeile pidempää salasanaa.';
  }

  if (normalizedMessage.includes('network')) {
    return 'Yhteys ei toiminut. Tarkista internet-yhteys.';
  }

  return message;
}

export function KiertlyEmailAuthScreen({ onBack, onAuthenticated }: KiertlyEmailAuthScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signUp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = authMode === 'signUp';

  function clearMessages() {
    if (errorMessage) {
      setErrorMessage('');
    }

    if (successMessage) {
      setSuccessMessage('');
    }
  }

  function changeAuthMode(nextMode: AuthMode) {
    Keyboard.dismiss();
    setAuthMode(nextMode);
    setErrorMessage('');
    setSuccessMessage('');
  }

  function validateForm() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Lisää sähköposti.');
      return false;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Kirjoita toimiva sähköpostiosoite.');
      return false;
    }

    if (!password) {
      setErrorMessage('Lisää salasana.');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Salasanan pitää olla vähintään 6 merkkiä.');
      return false;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage('Salasanat eivät täsmää.');
      return false;
    }

    if (isSignUp && !hasAcceptedTerms) {
      setErrorMessage('Hyväksy käyttöehdot jatkaaksesi.');
      return false;
    }

    return true;
  }

  async function validateAndContinue() {
    if (isSubmitting) {
      return;
    }

    Keyboard.dismiss();
    clearMessages();

    if (!validateForm()) {
      return;
    }

    const trimmedEmail = email.trim();

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMessage(getAuthErrorMessage(error.message));
          return;
        }

        if (data.session) {
          onAuthenticated();
          return;
        }

        setSuccessMessage('Tili luotu. Tarkista sähköposti ja vahvista tili ennen kirjautumista.');
        setAuthMode('signIn');
        setPassword('');
        setConfirmPassword('');
        setHasAcceptedTerms(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error.message));
        return;
      }

      onAuthenticated();
    } catch {
      setErrorMessage('Yhteys ei toiminut. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Takaisin"
              onPress={() => {
                Keyboard.dismiss();
                onBack();
              }}
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
                    clearMessages();
                  }}
                  placeholder="Sähköposti"
                  placeholderTextColor={theme.colors.mutedText}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  editable={!isSubmitting}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrap}>
                <Feather name="lock" size={22} color={theme.colors.mutedText} strokeWidth={1.8} />
                <TextInput
                  value={password}
                  onChangeText={(nextPassword) => {
                    setPassword(nextPassword);
                    clearMessages();
                  }}
                  placeholder="Salasana"
                  placeholderTextColor={theme.colors.mutedText}
                  secureTextEntry={!isPasswordVisible}
                  textContentType="password"
                  editable={!isSubmitting}
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
                      clearMessages();
                    }}
                    placeholder="Vahvista salasana"
                    placeholderTextColor={theme.colors.mutedText}
                    secureTextEntry={!isConfirmPasswordVisible}
                    textContentType="password"
                    editable={!isSubmitting}
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
                    Keyboard.dismiss();
                    setHasAcceptedTerms((currentValue) => !currentValue);
                    clearMessages();
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

              {successMessage ? (
                <View style={styles.successBox}>
                  <Feather name="check-circle" size={17} color="#405032" strokeWidth={2} />
                  <Text style={styles.successText}>{successMessage}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={validateAndContinue}
                disabled={isSubmitting}
                style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]}
              >
                <Text style={styles.continueText}>
                  {isSubmitting ? 'Hetki...' : isSignUp ? 'Jatka' : 'Kirjaudu'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => changeAuthMode(isSignUp ? 'signIn' : 'signUp')}
                disabled={isSubmitting}
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
      </TouchableWithoutFeedback>
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
  successBox: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#C9D8B8',
    borderRadius: 12,
    backgroundColor: '#EEF3E4',
  },
  successText: {
    flex: 1,
    color: '#405032',
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
  continueButtonDisabled: {
    opacity: 0.72,
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

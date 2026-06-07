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

type KiertlyEmailAuthScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function KiertlyEmailAuthScreen({ onBack, onContinue }: KiertlyEmailAuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

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
            <Text style={styles.title}>Jatka sähköpostilla</Text>
            <Text style={styles.subtitle}>Kirjaudu sisään tai luo tili sähköpostilla.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Feather name="mail" size={22} color={theme.colors.mutedText} strokeWidth={1.8} />
              <TextInput
                value={email}
                onChangeText={setEmail}
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
                onChangeText={setPassword}
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

            <View style={styles.inputWrap}>
              <Feather name="lock" size={22} color={theme.colors.mutedText} strokeWidth={1.8} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hasAcceptedTerms }}
              onPress={() => setHasAcceptedTerms((currentValue) => !currentValue)}
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

            <Pressable accessibilityRole="button" onPress={onContinue} style={styles.continueButton}>
              <Text style={styles.continueText}>Jatka</Text>
            </Pressable>

            <Pressable accessibilityRole="button" onPress={onContinue} hitSlop={12} style={styles.loginLinkWrap}>
              <Text style={styles.loginText}>
                Onko sinulla jo tili? <Text style={styles.loginLink}>Kirjaudu</Text>
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
    marginBottom: 26,
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

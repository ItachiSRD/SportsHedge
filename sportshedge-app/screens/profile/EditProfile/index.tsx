import Button from '@/components/general/buttons/Button';
import EditProfileHeader from '@/components/profile/EditProfile/EditProfileHeader';
import BaseScreen from '@/screens/BaseScreen';
import { MainBottomTabListT, ProfileStackListT } from '@/types/navigation/RootStackParams';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/core';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView, View } from 'react-native';
// import ChangeDpCard from '@/components/profile/EditProfile/ChangeDpCard';
import CustomText from '@/components/general/Text';
import Label from '@/components/general/inputs/Label';
import TextInput from '@/components/general/inputs/TextInput';
import VerifiedCredential from '@/components/profile/EditProfile/VerifiedCredential';
// import EmailVerificationBottomSheet from '@/components/profile/EditProfile/EmailVerificationBottomSheet';
import useSocialAuthLogin from '@/hooks/auth/useSocialAuthLogin';
import { colors } from '@/styles/theme/colors';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { useAuthStateContext } from '../../../context/auth';
import { isValidEmail } from '../../../util/email';

type EditProfileScreenProps = CompositeScreenProps<
  StackScreenProps<ProfileStackListT, 'EditProfile'>,
  BottomTabScreenProps<MainBottomTabListT>
>;

type UpdateStatesT = {
  status: 'init' | 'pending' | 'failed' | 'success';
  message?: string;
};

type EmailValidationT = {
  invalid: boolean;
  message: string;
};

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const { authUser, updateUserName, updateEmail } = useAuthStateContext();
  const { logOut } = useSocialAuthLogin();
  const [userName, setUserName] = useState(authUser?.displayName || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [emailValidation, setEmailValidation] = useState<EmailValidationT>();
  const [updateState, setUpdateState] = useState<UpdateStatesT>({ status: 'init' });

  const handleUpdate = async () => {
    try {
      setUpdateState({ status: 'pending' });
      setEmailValidation(undefined);

      // Return if invalid email
      if (!authUser?.email && !isValidEmail(email)) {
        setEmailValidation({ invalid: true, message: 'Invalid Email Address' });
        setUpdateState({ status: 'init' });
        return;
      }

      if (userName !== authUser?.displayName) {
        await updateUserName(userName);
      }

      if (!authUser?.email && email) {
        await updateEmail(email);
      }
      setUpdateState({ status: 'success' });
    } catch (err) {
      console.error('Failed to update user details', err);
      const error = err as FirebaseError;
      if (error.code === 'auth/requires-recent-login') {
        await logOut();
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailValidation({ invalid: true, message: 'Email already in use' });
        setUpdateState({ status: 'init' });
        return;
      } else {
        setUpdateState({ status: 'failed', message: error.message });
      }
    }
  };

  return (
    <BaseScreen>
      <View className="flex-1 py-[22px] px-[30px]">
        <EditProfileHeader onGoBack={() => navigation.goBack()} />
        <ScrollView>
          <View style={{ gap: 40 }} className="py-9 justify-between">
            {/* <ChangeDpCard /> */}
            <View style={{ gap: 12 }}>
              {authUser?.phoneNumber ? <VerifiedCredential text={authUser.phoneNumber} /> : null}
              {authUser?.emailVerified ? <VerifiedCredential text={authUser.email!} /> : null}
            </View>
            <View>
              <Label labelTitleProps={{ fontWeight: 400 }} title="Name" />
              <TextInput
                containerProps={{ className: 'mt-1' }}
                shape="rounded"
                placeholder="Enter your name"
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            {!authUser?.emailVerified ? (
              <View>
                <Label labelTitleProps={{ fontWeight: 400 }} title="Email" />
                <TextInput
                  containerProps={{ className: 'mt-1' }}
                  shape="rounded"
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  status={emailValidation ? 'error' : undefined}
                  statusMsg={emailValidation?.message}
                />
                <CustomText className="text-xs leading-[18px] mt-2 text-theme-content-active">
                  You will receive an OTP for verification
                </CustomText>
                {/* <EmailVerificationBottomSheet code={code} setCode={setCode} /> */}
              </View>
            ) : null}
            <Button
              variant="outlined"
              size="large"
              shape="rounded"
              containerClass="border-brand-content"
              textClass="text-brand-content"
              title="Update"
              onPress={handleUpdate}
              loading={updateState.status === 'pending'}
              disabled={updateState.status === 'pending'}
              loaderColor={colors['theme-reverse']}
            />
          </View>
          <Button
            containerClass="justify-start"
            variant="ghost"
            title="Log Out"
            textClass="leading-[21px] tracking-[0.56px] text-brand-content"
            onPress={logOut}
          />
        </ScrollView>
      </View>
    </BaseScreen>
  );
};

export default EditProfileScreen;

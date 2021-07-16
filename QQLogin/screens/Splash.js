import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { StyledContainer, InnerContainer, PageLogo, PageTitle, SignInButton, LogInButton } from '../components/styles';

const Splash = ({navigation}) => {
  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageTitle>QuickQuAck</PageTitle>
        <PageLogo resizeMode="cover" source={require('./../assets/Logo.png')} />
        <SignInButton onPress={() => navigation.navigate('Signup')} />
        <LogInButton onPress={() => navigation.navigate('Login')} />
      </InnerContainer>
    </StyledContainer>
  );
};

export default Splash;

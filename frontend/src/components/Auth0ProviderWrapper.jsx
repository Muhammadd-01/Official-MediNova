// src/components/Auth0ProviderWrapper.jsx
import { Auth0Provider } from "@auth0/auth0-react";

export function Auth0ProviderWrapper({ children }) {
  return (
    <Auth0Provider
      domain="medinova.us.auth0.com"
      clientId="C0aBMkwOqEz70XvfK7vNgfklT2kXifTU"
      redirectUri={window.location.origin + "/"}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}

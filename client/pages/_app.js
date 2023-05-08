import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  // if (currentUser) {
  //   return (
  //     <div>
  //       <Header currentUser={currentUser}/>
  //       <h1>Logged User : {currentUser.email}</h1>
  //       <Component {...pageProps} />
  //     </div>
  //   );
  // } else {
  //   return (
  //     <div>
  //       <Header currentUser={currentUser}/>
  //       <h1>Logged User : </h1>
  //       <Component {...pageProps} />
  //     </div>
  //   );
  // }

  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

// NB: this code is executed at the level of the server (server side rendering)
AppComponent.getInitialProps = async (appContext) => {

  const reqContext = appContext.ctx;

  const client = buildClient(reqContext);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(reqContext);
  }

  return {
    pageProps,
    ...data
  };
}

export default AppComponent;

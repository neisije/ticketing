import buildClient from "../api/build-client";

// NB : the code of a component is executed on the browser
const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are unsigned</h1>
};

// NB: this code is executed at the level of the server (server side rendering)
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  console.log('LANDING PAGE !')
  const { data } = await client.get('/api/users/currentuser');
  return data;
}

export default LandingPage;

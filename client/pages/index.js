import buildClient from "../api/build-client";

// NB : the code of a component is executed on the browser
const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

// NB: this code is executed at the level of the server (server side rendering)
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
}

export default LandingPage;

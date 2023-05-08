import axios from "axios";

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // console.log('I am executed on the server');

    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });

  } else {
    // console.log('I am executed on the browser');
    return axios.create({});
  }
}

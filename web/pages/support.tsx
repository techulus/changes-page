export function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: "https://techulus.atlassian.net/servicedesk/customer/portal/1",
    },
  };
}

function EmptyPage() {
  return null;
}

export default EmptyPage;
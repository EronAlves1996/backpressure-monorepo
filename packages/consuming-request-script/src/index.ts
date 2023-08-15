for (let i = 0; i < 1000; i++) {
  fetch("http://127.0.0.1:3001/").then((res) => {
    console.log("Get response");
  });
}

for (let i = 0; i < 15000; i++) {
  fetch("http://localhost:3000/").then((res) => {
    console.log("Get response");
  });
}

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log(data)
    
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body: "Get Ready for contest", //the body of the push notification
            image: `${data.image}`,
            
        }
    );
});
// image
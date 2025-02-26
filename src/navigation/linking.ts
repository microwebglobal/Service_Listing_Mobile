const config = {
  screens: {
    SignUp: 'signup',
    SignIn: 'signin',
    SelectedItems: 'cart',
    Notification: 'notification',
    TabsNavigator: {
      screens: {
        HomeTab: {
          screens: {
            Home: 'home',
          },
        },
        CategoryTab: {
          screens: {
            Category: 'category',
            SubCategory: 'category/subcategory',
            ServiceType: 'category/service-type',
          },
        },
        Ticket: 'ticket',
        BookingTab: {
          screens: {
            Booking: 'booking',
            BookingDetails: 'booking/details',
          },
        },
        ProfileTab: {
          screens: {
            Profile: 'profile',
            EditProfile: 'profile/edit',
          },
        },
      },
    },
  },
};

const linking: any = {
  prefixes: ['http://service-app', 'https://service-app'],
  config,
};

export default linking;

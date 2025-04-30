import Toast from 'react-native-toast-message';

function convertTo12HourFormat(timeString: string) {
  const [hour, minute] = timeString.split(':');
  let formattedHour = parseInt(hour, 10);
  if (formattedHour > 12) {
    formattedHour -= 12;
    return `${formattedHour}:${minute} PM`;
  }
  return `${formattedHour}:${minute} AM`;
}

function getOtpFromSocket({socket, userId}: {socket: any; userId: number}) {
  if (!socket || !userId) {
    return;
  }

  socket.emit('join-booking', userId);

  const onOtpReceived = (data: any) => {
    Toast.show({
      type: 'success',
      text1: 'OTP Received',
      text2: data.otp
        ? `Your booking OTP is ${data.otp}`
        : data.customerMessage,
      autoHide: false,
    });
  };

  socket.on('otp-generated', onOtpReceived);

  return () => {
    socket.off('otp-generated', onOtpReceived);
  };
}

export {convertTo12HourFormat, getOtpFromSocket};

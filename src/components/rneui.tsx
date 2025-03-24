import React, {FC} from 'react';

import {
  Button as RenuiButton,
  ButtonProps,
} from '@rneui/themed';
import {classed} from '@tw-classed/react';

export const Button: FC<
  ButtonProps & {
    primary?: boolean;
    success?: boolean;
    white?: boolean;
    error?: boolean;
    black?: boolean;
    textColor?: string;
  }
> = ({...props}) => {
  const StyledRenuiButton = classed(RenuiButton);
  return <StyledRenuiButton {...props} />;
};

import React from 'react';

import logo from '../assets/icon.png';

export const SnapLogo = ({
  color,
  size,
}: {
  color?: string | undefined;
  size: number;
}) => <img src={logo} width="30px" />;

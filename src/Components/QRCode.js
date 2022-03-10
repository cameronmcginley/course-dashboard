import QRCodeReact from 'qrcode.react'
import React from 'react'
import styled from 'styled-components'
// https://github.com/zpao/qrcode.react/issues/12

const ResponsiveSvgWrapper = styled.div`
  & > svg {
    display: block; /* svg is "inline" by default */
    height: auto; /* reset height */
    width: 100%; /* reset width */
  }
`
const QRCode = (props) => {
    return(
  <ResponsiveSvgWrapper>
    <QRCodeReact renderAs="svg" value={props.value} />
  </ResponsiveSvgWrapper>
    )
};

export default QRCode;
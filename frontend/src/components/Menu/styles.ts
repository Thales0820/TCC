import { css } from "@emotion/css";


export const menu = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #222831;
    height: 768px;
    border-radius: 0px 18px 18px 0px;
    position: fixed;
    stroke: 4px #ffffff;
    transition: all .5s;
    min-width: 158px;
    z-index: 2;
`

export const divPai = css`
    padding: 12px;
`

export const divLogo = css`
    text-align: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    border-bottom: 1px solid #ffffff;
`

export const ul = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
    margin-left: -30px;

    li {
        border-radius: 8px;
        padding: 14px;
        cursor: pointer;
    }

    li a {
        text-decoration: none;
        display: flex;
        align-items: start;
        justify-content: start;
        color: #00337C;
    }
`
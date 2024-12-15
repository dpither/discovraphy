export default function Logo({ fill }: { fill: string }) {
  return (
    <svg
      fill={fill}
      className="w-full object-cover"
      viewBox="0 0 1985 305"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M55.803 206H7.793l.278-10.298h47.732q21.849 0 38.408-10.159 16.7-10.158 26.163-28.11 9.462-18.09 9.462-41.609V93.141q0-17.535-5.427-32.146t-15.307-25.188q-9.742-10.575-23.24-16.282-13.5-5.844-29.502-5.844H6.958V3.383H56.36q18.23 0 33.677 6.54 15.585 6.402 26.997 18.37 11.41 11.828 17.673 28.527 6.401 16.56 6.401 36.739v22.265q0 20.178-6.401 36.878-6.262 16.56-17.812 28.527-11.412 11.829-26.998 18.37-15.446 6.4-34.094 6.401M11.272 3.383V206H0V3.383zm205.874 0V206h-11.272V3.383zm191.679 153.493q0-9.045-3.062-16.142-3.061-7.236-10.159-12.803-6.957-5.706-18.369-10.576-11.41-4.87-28.11-9.463-15.308-4.174-27.693-9.045-12.246-5.01-21.013-11.411-8.628-6.402-13.22-15.169-4.593-8.906-4.593-21.013 0-11.69 5.01-21.013t14.055-15.864q9.185-6.68 21.431-10.16Q335.487.6 350.099.6q20.457 0 35.764 7.793 15.308 7.654 23.936 21.291 8.628 13.499 8.628 31.033h-11.272q0-14.334-7.097-25.606-6.958-11.271-19.761-17.673-12.664-6.54-30.198-6.54-18.09 0-30.754 5.566-12.525 5.566-19.065 14.75-6.402 9.046-6.402 19.762 0 7.653 2.784 14.333 2.922 6.68 9.463 12.246 6.68 5.566 17.951 10.576 11.411 4.871 28.389 9.463 15.585 4.036 27.971 9.185 12.524 5.01 21.431 11.828 8.906 6.819 13.637 16.143 4.732 9.324 4.732 21.848 0 12.385-5.288 22.127-5.289 9.602-14.751 16.421-9.324 6.68-21.988 10.158-12.524 3.48-26.997 3.479-13.22 0-26.579-3.2-13.22-3.201-24.214-10.298-10.994-7.098-17.673-18.648-6.68-11.55-6.68-28.11h11.272q0 14.194 5.845 23.935 5.845 9.602 15.307 15.308t20.596 8.21q11.272 2.505 22.126 2.505 16.978 0 29.92-5.149 13.081-5.288 20.317-14.611 7.376-9.464 7.376-21.849m192.931-13.359h11.272q-2.087 21.291-11.411 35.903-9.323 14.473-25.049 21.988-15.585 7.375-36.738 7.375-16.839 0-30.615-6.401-13.638-6.541-23.518-18.369-9.741-11.968-15.03-28.528t-5.288-36.599V90.497q0-20.178 5.288-36.6 5.289-16.56 15.03-28.388 9.88-11.967 23.657-18.369Q523.27.6 540.387.6q20.734 0 36.321 7.375 15.585 7.376 24.909 21.987 9.324 14.473 11.411 35.765h-11.272q-2.087-17.675-9.602-29.78-7.375-12.247-20.317-18.648-12.942-6.402-31.45-6.401-14.612 0-26.302 5.705-11.689 5.566-20.039 16.143-8.349 10.437-12.942 25.048-4.453 14.473-4.453 32.425v28.667q0 17.673 4.453 32.424 4.453 14.611 12.664 25.188 8.21 10.437 19.9 16.282 11.69 5.705 26.162 5.705 18.509 0 31.589-5.844 13.081-5.984 20.596-18.23 7.654-12.246 9.741-30.894m334.931 40.635 66.383-180.77h12.24L939.749 206h-9.742zM864.463 3.382l66.379 180.77 6.68 21.848h-9.741L852.217 3.383zm196.267.001h64.99c13.36 0 25.1 2.273 35.21 6.819s18 11.179 23.66 19.9c5.75 8.72 8.62 19.436 8.62 32.146 0 9.74-2.08 18.554-6.26 26.44-4.17 7.886-9.83 14.426-16.97 19.622-7.15 5.102-15.22 8.442-24.22 10.019l-4.87 1.809h-74.73l-.28-10.298h65.55c11.22 0 20.55-2.273 27.97-6.819 7.51-4.545 13.13-10.436 16.84-17.673q5.7-10.994 5.7-23.1c0-10.113-2.27-18.74-6.82-25.884-4.45-7.237-10.9-12.803-19.34-16.7q-12.525-5.983-30.06-5.983h-53.71V206h-11.28zM1189.74 206l-54.28-89.897 12.53-.14 53.71 88.089V206zm131.84-193.99L1249.49 206h-11.97l76.12-202.617h9.33zM1389.76 206l-71.94-193.99-1.39-8.627h9.18L1401.87 206zm-17.81-69.441v10.437H1268v-10.437zm141.31-14.89h-60.12v-10.298h60.12c12.98 0 23.56-2.134 31.72-6.401q12.255-6.541 17.82-17.395 5.7-10.994 5.7-24.214 0-13.638-5.7-24.91-5.565-11.272-17.82-17.951c-8.16-4.546-18.74-6.82-31.72-6.82h-54.28V206h-11.27V3.383h65.55c14.56 0 26.76 2.505 36.59 7.515q14.895 7.515 22.41 21.013c5.01 8.906 7.51 19.297 7.51 31.172 0 12.06-2.5 22.497-7.51 31.31-5.01 8.721-12.43 15.447-22.27 20.179-9.83 4.731-22.08 7.097-36.73 7.097m260.14-25.188v10.437h-131.23V96.481zM1646.07 3.383V206h-11.27V3.383zm135.4 0V206h-11.27V3.383zm55.44 0 66.8 115.503 67.35-115.503h13.36l-75.14 125.94V206h-11.27v-76.677l-75.15-125.94z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M739.003 10c-52.467 0-95 42.533-95 95s42.533 95 95 95 95-42.533 95-95-42.533-95-95-95m-105 95c0-57.99 47.01-105 105-105s105 47.01 105 105-47.01 105-105 105-105-47.01-105-105"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M701.003 104.5c0 20.711 16.789 37.5 37.5 37.5s37.5-16.789 37.5-37.5-16.789-37.5-37.5-37.5-37.5 16.79-37.5 37.5m37.5 32.5c-17.949 0-32.5-14.551-32.5-32.5 0-17.95 14.551-32.5 32.5-32.5s32.5 14.55 32.5 32.5-14.551 32.5-32.5 32.5"
      />
      <path d="M729.003 105c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10m89.213 121.64c-11.716-11.716-11.716-30.711 0-42.427s30.711-11.716 42.427 0l56.568 56.569c11.716 11.715 11.716 30.71 0 42.426s-30.711 11.716-42.426 0z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M787.507 84.91a52.5 52.5 0 0 0-28.413-28.414l1.913-4.62a57.5 57.5 0 0 1 31.119 31.12zm13.858-5.741a67.5 67.5 0 0 0-36.531-36.53l1.913-4.62a72.5 72.5 0 0 1 39.237 39.236zm13.858-5.74a82.5 82.5 0 0 0-44.649-44.65l1.914-4.619a87.5 87.5 0 0 1 47.354 47.355zm-124.724 51.662a52.5 52.5 0 0 0 28.413 28.413l-1.913 4.619a57.5 57.5 0 0 1-31.119-31.119zm-13.858 5.74a67.5 67.5 0 0 0 36.531 36.531l-1.914 4.619a72.5 72.5 0 0 1-39.236-39.236zm-13.858 5.74a82.5 82.5 0 0 0 44.649 44.649l-1.914 4.619a87.5 87.5 0 0 1-47.355-47.354z"
      />
    </svg>
  );
}

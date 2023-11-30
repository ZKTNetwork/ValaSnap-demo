import { BigNumber, Contract } from 'ethers';
import { providers } from 'ethers';

import { useContext, useState } from 'react';
import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  CreateButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  ModalCloseButton,
} from '@chakra-ui/react';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
  color: #fafafa;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0 100px;
  color: #fafafa;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const demo = {
  address: '0x8eEc310Fb1A96e3D127CeB288D7CEC5740F2a9Bb',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'target',
          type: 'address',
        },
      ],
      name: 'AddressEmptyCode',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'AddressInsufficientBalance',
      type: 'error',
    },
    {
      inputs: [],
      name: 'FailedInnerCall',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'token',
          type: 'address',
        },
      ],
      name: 'SafeERC20FailedOperation',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'id',
          type: 'bytes32',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'claimer',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: 'isVerified',
              type: 'bool',
            },
            {
              internalType: 'bool',
              name: 'isUsed',
              type: 'bool',
            },
            {
              internalType: 'bool',
              name: 'initialized',
              type: 'bool',
            },
          ],
          indexed: false,
          internalType: 'struct ValaPortal.Ticket',
          name: 'ticket',
          type: 'tuple',
        },
      ],
      name: 'CreateTicket',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'id',
          type: 'bytes32',
        },
      ],
      name: 'TicketUsed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'id',
          type: 'bytes32',
        },
      ],
      name: 'VerifyTicket',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'id',
          type: 'bytes32',
        },
      ],
      name: 'claim',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract IERC20',
          name: 'token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'claimer',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: 'id',
          type: 'bytes32',
        },
      ],
      name: 'deposit',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTicketIDList',
      outputs: [
        {
          internalType: 'bytes32[]',
          name: 'ticketIDList',
          type: 'bytes32[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTicketList',
      outputs: [
        {
          components: [
            {
              internalType: 'address',
              name: 'claimer',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: 'isVerified',
              type: 'bool',
            },
            {
              internalType: 'bool',
              name: 'isUsed',
              type: 'bool',
            },
            {
              internalType: 'bool',
              name: 'initialized',
              type: 'bool',
            },
          ],
          internalType: 'struct ValaPortal.Ticket[]',
          name: 'ticketList',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'id',
          type: 'bytes32',
        },
      ],
      name: 'verify',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
const rpcURL = 'https://rpc.goerli.linea.build';

async function getAccount() {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  console.log(accounts);
}
// const web3 = new Web3(window.ethereum);
const _provider = new providers.Web3Provider(window.ethereum);
const signerOrProvider = _provider;

const contract = new Contract(demo.address, demo.abi, signerOrProvider);

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [isOpen, setIsOpen] = useState(false);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  getAccount();
  // console.log(contract)
  // console.log('web3', contract.methods.getTicketList());
  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  return (
    <Container>
      <Heading>Vala Portal Verifier</Heading>
      <Subtitle>
        Welcome to Vala Portal, where the future of peer-to-peer stablecoin
        transactions unfolds. Our innovative platform, built on SNAP, introduces
        a seamless integration of on-chain and off-chain payment systems, with
        zk proof verification proudly powered by{' '}
        <a
          href="https://padolabs.org/"
          style={{
            color: '#0fc',
          }}
          target="_blank"
        >
          Pado
        </a>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  // disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}

        <Card
          content={{
            title: 'Create a P2P Transaction',
            description: 'Quickly set up secure P2P transactions with ease.',
            button: (
              <CreateButton
                onClick={async () => {setIsOpen(true)}}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
      </CardContainer>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>P2P Transaction</ModalHeader>
          <ModalBody>
            amount
            <Input placeholder='amount of zkUSD' mb="15"/>
            claimer
            <Input placeholder='claimer' value="0x8DB327799911768FC3692930220c2D5C780fC30a" mb="15"/>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={30}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const params = [
                  {
                    from: '0x82d751c236Cb6c682A54196Ef6fc01021a101a1B',
                    to: '0x8eEc310Fb1A96e3D127CeB288D7CEC5740F2a9Bb',
                    gas: '0x76c00', // 30400
                    gasPrice: '0x9184e72a000', // 10000000000000
                    // value: '0',
                    data: '0x979d49710000000000000000000000004a1abd59d793abb174bc0f211410a93baad49d2a00000000000000000000000000000000000000000000000000000000000000010000000000000000000000008db327799911768fc3692930220c2d5c780fc30a1600000000000000000000000000000000000000000000000000000000000000',
                  },
                ];

                window.ethereum
                  .request({
                    method: 'eth_sendTransaction',
                    params,
                  })
                  .then((result) => {})
                  .catch((error) => {});
              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;

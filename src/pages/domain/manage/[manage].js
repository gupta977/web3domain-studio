import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
var w3d = require("@web3yak/web3domain");
import { useURLValidation } from "../../../hooks/validate";
import { useJsonValue } from "../../../hooks/jsonData";
import { generateJson } from '../../../hooks/ipfs';
import TokenURI from '../../../components/TokenURI'; // Adjust the path to the actual location
import { useAccount, useNetwork } from "wagmi";
import Link from "next/link";

import {
  Icon,
  Box,
  Button,
  Container,
  Flex,
  SkeletonText,
  Skeleton,
  CardHeader,
  Heading,
  Stack,
  SkeletonCircle,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  InputLeftElement,
  InputGroup,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  FormErrorMessage,
  CircularProgress,
  Divider
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  FaBitcoin,
  FaEthereum,
  FaWallet,
  FaEnvelope,
  FaPhoneAlt,
  FaTwitter,
  FaTelegram,
  FaFacebookSquare,
  FaYoutube,
  FaInstagram,
  FaDiscord,
  FaRightLong,
  FaRightFromBracket,
  FaForward,
} from "react-icons/fa";
import {
  DOMAIN,
  DOMAIN_IMAGE_URL,
  DOMAIN_NETWORK_CHAIN,
  DOMAIN_DESCRIPTION,
} from "../../../configuration/Config";


export default function Manage() {
  const { isConnected, connector, address } = useAccount();
  const router = useRouter();
  const { manage } = router.query;
  const domain = manage ? String(manage).toLowerCase() : "";

  
  
  const [jsonData, setJsonData] = useState(null); // Initialize jsonData as null
  const [jsonDataNew, setJsonDataNew] = useState(null); // Initialize jsonData as null
  const { getValue } = useJsonValue(jsonData);
  const [claimUrl, setClaimUrl] = useState('http://web3domain.org');

  const [isMainLoading, setIsMainLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [discord, setDiscord] = useState("");
  const [instagram, setInstagram] = useState("");
  const [btc, setBtc] = useState("");
  const [eth, setEth] = useState("");
  const [matic, setMatic] = useState("");
  const [bsc, setBsc] = useState("");
  const [fil, setFil] = useState("");
  const [sol, setSol] = useState("");



  const { validateURL } = useURLValidation();
  const handleURLChange = (event) => {
    const inputURL = event.target.value;
  
    

    const isValid = validateURL(inputURL);
    // You can perform further actions based on the URL validity
    if (isValid) {
      return true;
    } else {
      return false;
    }
  };

  const handleUpload  = async () => {
    console.log("Verify record of  " + domain);
    setIsLoading(true);
    if (domain !== 'undefined') {
      
      console.log('Verify data running...');
      const response = await generateJson(jsonDataNew, domain);
      if (response.ok) {
        const responseText = await response.text();

        try {
          const responseObject = JSON.parse(responseText);
          const cidValue = responseObject.cid;
          console.log('https://ipfs.io/ipfs/' +cidValue);
          setClaimUrl('https://ipfs.io/ipfs/' + cidValue);
          setIsLoading(false);
         
        } catch (error) {
          console.log("Error parsing JSON:", error);
        }
        
      } else {
        console.log("Error generating JSON.");
        setIsLoading(false);
      }
    }
  }

   const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Saving record..');

    const array = {
      name: manage,
      description: DOMAIN_DESCRIPTION,
      image: DOMAIN_IMAGE_URL,
      attributes: [
        { trait_type: "domain", value: manage },
        { trait_type: "level", value: "2" },
        { trait_type: "length", value: 8 },
      ],
      records: {
        1: { type: "name", value: profile },
        2: { type: "email", value: email },
        3: { type: "website", value: url },
        4: { type: "phone", value: phone },
        5: { type: "tg_bot", value: "Web3Domain Telegram Bot" },
        6: {
          type: "social",
          value: {
            twitter: twitter,
            telegram: telegram,
            discord: discord,
            youtube: youtube,
            facebook: facebook,
            instagram: instagram,
          },
        },
        7: {
          type: "link",
          value: {
            OpenSea: "",
          },
        },
        8: {
          type: "crypto",
          value: {
            matic: matic,
            fil: fil,
            sol: sol,
            bsc: bsc,
            eth: eth,
          },
        },
        9: { type: "notes", value: notes },
        50: { type: "web_url", value: "" },
        51: { type: "web3_url", value: url },
      },
    };
    console.log(array);

    setJsonDataNew(array);
  };

  useEffect(() => {
    setIsMainLoading(true);

    
    if (domain) {
      const url = "https://w3d.name/api/v1/index.php?domain=" + domain;
      console.log(url);
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          setJsonData(json); // Store the json response in the component's state
          setIsMainLoading(false);
          console.log(json);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchData();
    }
  }, [domain]);

  useEffect(() => {
    if (jsonData) {
      setProfile(jsonData && getValue("name"));
      setEmail(jsonData && getValue("email"));
      setPhone(jsonData && getValue("phone"));
      setUrl(jsonData && getValue("website"));
      setTwitter(jsonData && getValue("twitter"));
      setTelegram(jsonData && getValue("telegram"));
      setFacebook(jsonData && getValue("facebook"));
      setYoutube(jsonData && getValue("youtube"));
      setInstagram(jsonData && getValue("instagram"));
      setDiscord(jsonData && getValue("discord"));
      setBtc(jsonData && getValue("btc"));
      setEth(jsonData && getValue("eth"));
      setMatic(jsonData && getValue("matic"));
      setBsc(jsonData && getValue("bsc"));
      setFil(jsonData && getValue("fil"));
      setSol(jsonData && getValue("sol"));
      setNotes(jsonData && getValue("notes"));

      // ... (initialize other states similarly)
    }
  }, [jsonData]);

  
  return (
    <Flex
      align="center"
      justify="center"
      bg={useColorModeValue("white", "gray.700")}
      borderRadius="md"
      color={useColorModeValue("gray.700", "whiteAlpha.900")}
      shadow="base"
    >
      <Box
        textAlign="center"
        alignContent={"center"}
        borderRadius="lg"
        p={{ base: 5, lg: 2 }}
        bgSize={"lg"}
        maxH={"80vh"}
      >
        <Container maxW={"3xl"} alignItems={"center"} justifyContent={"center"}>
          <Heading as="h5" size="sm">
            On-Chain Blockchain Records ({domain})
          </Heading>
          <Divider /><br/>
          {isMainLoading ? (
            <Box padding="6" boxShadow="lg" bg="white">
              <SkeletonCircle size="10" />
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="3"
              />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>General</Tab>
                  <Tab>Contact</Tab>
                  <Tab>Social</Tab>
                  <Tab>Wallet</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <FormControl isRequired mt={2}>
                      <FormLabel>Profile Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="Company / Your name"
                        size="md"
                        value={profile}
                        onChange={(event) =>
                          setProfile(event.currentTarget.value)
                        }
                      />
                    </FormControl>

                    <FormControl mt={2}>
                      <FormLabel>Extra Information</FormLabel>
                      <Textarea
                        placeholder="Extra Information goes here..."
                        size="md"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                      />
                    </FormControl>
                  </TabPanel>

                  <TabPanel>
                    <Stack spacing={2}>
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaEnvelope color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="email"
                            placeholder="Email Address"
                            size="md"
                            value={email}
                            onChange={(event) =>
                              setEmail(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaPhoneAlt color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="tel"
                            placeholder="Phone number"
                            value={phone}
                            size="md"
                            onChange={(event) =>
                              setPhone(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isInvalid={!validateURL(url)}>
                        <FormLabel>Website Link</FormLabel>
                        <Input
                          type="url"
                          placeholder="https://"
                          size="md"
                          value={url}
                          onChange={(event) => {
                            setUrl(event.target.value); // Update email state
                            handleURLChange(event); // Validate and perform necessary actions
                          }}
                        />
                        <FormErrorMessage>
                          Enter valid website link
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </TabPanel>

                  <TabPanel>
                    <Stack spacing={2}>
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaTwitter color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="url"
                            placeholder="Twitter Link"
                            value={twitter}
                            size="sm"
                            onChange={(event) =>
                              setTwitter(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaTelegram color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="url"
                            placeholder="Telegram Link"
                            size="sm"
                            value={telegram}
                            onChange={(event) =>
                              setTelegram(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaFacebookSquare color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="url"
                            placeholder="Facebook Link"
                            value={facebook}
                            size="sm"
                            onChange={(event) =>
                              setFacebook(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaYoutube color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="url"
                            placeholder="Youtube Link"
                            size="sm"
                            value={youtube}
                            onChange={(event) =>
                              setYoutube(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaInstagram color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="url"
                            placeholder="Instagram Link"
                            value={instagram}
                            size="sm"
                            onChange={(event) =>
                              setInstagram(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaDiscord color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="url"
                            placeholder="Discord Link"
                            value={discord}
                            size="sm"
                            onChange={(event) =>
                              setDiscord(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>
                    </Stack>
                  </TabPanel>

                  <TabPanel>
                    <Stack spacing={3}>
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaBitcoin color="red.500" />
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Bitcoin Wallet Address"
                            value={btc}
                            size="sm"
                            onChange={(event) =>
                              setBtc(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaEthereum color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Ethereum Wallet Address"
                            value={eth}
                            size="sm"
                            onChange={(event) =>
                              setEth(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaEthereum color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Polygon Wallet Address"
                            value={matic}
                            size="sm"
                            onChange={(event) =>
                              setMatic(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaEthereum color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="BSC Wallet Address"
                            value={bsc}
                            size="sm"
                            onChange={(event) =>
                              setBsc(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaWallet color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Filecoin Wallet Address"
                            value={fil}
                            size="sm"
                            onChange={(event) =>
                              setFil(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaWallet color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="text"
                            placeholder="Solana Wallet Address"
                            value={sol}
                            size="sm"
                            onChange={(event) =>
                              setSol(event.currentTarget.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Stack direction="row" spacing={4}>
                <Button rightIcon={<FaForward />} colorScheme="teal" type="submit" width="half" mt={4}>
                  Save 
                </Button>
                {jsonDataNew != null ? (
                  <Button rightIcon={<FaForward />} colorScheme="green" width="half" mt={4}  onClick={() => handleUpload()} >
                    
                    {isLoading ? (

  <>  <CircularProgress isIndeterminate size="24px"/> Submitting </>
  ) : (
    'Verify'
  )}
                    
                  </Button>
                ) : (
                  <></>
                )}

{ claimUrl != 'http://web3domain.org' ? (<TokenURI domainName={domain} TokenURI={claimUrl} />) : ( <></>)}



              </Stack>
            </form>
          )}
        </Container>
      </Box>
    </Flex>
  );

}

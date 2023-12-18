import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
var w3d = require("@web3yak/web3domain");
import Link from 'next/link';
import useDomainInfo from '../../../hooks/domainInfo';
import { useURLValidation } from '../../../hooks/validate';
import { useNetworkValidation, checkContract } from '../../../hooks/useNetworkValidation';
import { useJsonValue } from "../../../hooks/jsonData";
import { generateJson, generateImage } from '../../../hooks/ipfs';
import TokenURI from '../../../components/TokenURI'; // Adjust the path to the actual location

import {
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
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Kbd,
  ButtonGroup,
  IconButton,
  useClipboard,
  InputGroup,
  Input,
  InputRightElement,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  form,
  CircularProgress

} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaCopy, FaExternalLinkAlt, FaForward } from "react-icons/fa";
import { useAccount, useNetwork } from "wagmi";
import { DOMAIN_TLD, NETWORK_ERROR, DOMAIN_IMAGE_URL, SITE_URL } from '../../../configuration/Config'


export default function Info() {
  const { isConnected, connector, address } = useAccount();
  const { validateURL } = useURLValidation();
  const isNetworkValid = useNetworkValidation();
  const router = useRouter();
  const { image } = router.query;
  const domain = image ? String(image).toLowerCase() : "";
  const { ownerAddress } = useDomainInfo(domain);
  const [jsonData, setJsonData] = useState(null); // Initialize jsonData as null
  const { getValue } = useJsonValue(jsonData);
  const [error, setError] = useState('');
  const [claimUrl, setClaimUrl] = useState('http://web3domain.org');
  const [isLoading, setIsLoading] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [nftImage, setNftImage] = useState(DOMAIN_IMAGE_URL);
  const [jsonDataNew, setJsonDataNew] = useState(null); // Initialize jsonDataNew as null
  const [show, setShow] = useState(false);

  let firstImg=jsonData?.image && jsonData.image.startsWith("ipfs://") ? jsonData.image.replace("ipfs://", "https://ipfs.io/ipfs/") : jsonData?.image;
  


  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    console.log('Saving record..');

   // console.log(jsonData);

// Update the jsonDataNew object with the new "image" value
const updatedJsonData = {
  ...jsonData,
  image: nftImage, // Set the "image" property to the new value (nftImage)
};


    setJsonDataNew(updatedJsonData); // Update the state with the modified jsonData

    console.log(updatedJsonData);
    setIsLoading(false);
  };

  const handleUpload = async () => {
    console.log("Verify record of  " + domain);
    setIsLoading(true);
    if (domain !== 'undefined') {

      //console.log(jsonData);

      await genJson();

    }
  }

  async function genImage(domainName) {

    const key = '100';

    const imageContent = await generateImage(domainName, key, SITE_URL);
    if (imageContent) {
      console.log('Image content:', imageContent);
      //https://bafkreiak3kms5q6jn6xjowri3rpwn7agb5zqnenvb4auo3vrwbhedqhbw4.ipfs.nftstorage.link/
     // setNftImage("https://ipfs.io/ipfs/" + imageContent);
      setNftImage("https://" + imageContent +".ipfs.nftstorage.link");
      //console.log(jsonData);
      setIsLoading(false);
      setShow(true);
    } else {
      console.log('Failed to generate image content.');
      setIsLoading(false);
    }

  }

  async function genJson() {
    //console.log(jsonDataNew);
    const response = await generateJson(jsonDataNew, domain);
    if (response.ok) {
      const responseText = await response.text();

      try {
        const responseObject = JSON.parse(responseText);
        const cidValue = responseObject.cid;
        console.log('https://ipfs.io/ipfs/' + cidValue);
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

  const updateImage = async () => {
    console.log("Update the image");
    setIsLoading(true);
    await genImage(domain);
    
  }


  useEffect(() => {

    setIsMainLoading(true); // Set isLoading to true whenever the effect runs

    if (domain) {
      const randomNumber = Math.random();
      const url = "https://web3domain.org/api/v1/index.php?domain=" + domain + "&" + randomNumber;
      // console.log(url);
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          setJsonData(json); // Store the json response in the component's state
          setIsMainLoading(false);
          // console.log(json);
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchData();

    }
  }, [domain]);

 
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
        p={{ base: 2, lg: 1 }}
        bgSize={"lg"}
        maxH={"80vh"}
      >
        <Container
          maxW={"3xl"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Kbd><Link href={`/domain/info/${domain}`}>{domain}</Link></Kbd>
          <Box
            textAlign="center"
            alignContent={"center"}
            borderRadius="lg"
            p={{ base: 5, lg: 2 }}
            bgSize={"lg"}
            maxH={"80vh"}
          >
            {isNetworkValid && domain.endsWith('.' + DOMAIN_TLD) ? (
              <Stack
                as={Box}
                textAlign={"center"}
                spacing={{ base: 2, md: 2 }}
                py={{ base: 10, md: 6 }}
              >

                {isMainLoading ? (
                  <Box padding='6' boxShadow='lg' bg='white'>
                    <SkeletonCircle size='10' />
                    <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='3' />
                  </Box>
                ) : (
                  <>
                    {error ? (
                      <p>Error: {error}</p>
                    ) : (
                      <p>

                        {address == ownerAddress ?
                          <form onSubmit={handleSubmit}>
                            <Card
                              direction={{ base: 'column', sm: 'row' }}
                              overflow='hidden'
                              variant='outline'
                              align='center'
                            >
{nftImage == DOMAIN_IMAGE_URL ?  (
                              <Image
                                ml={2}
                                boxSize='200px'
                                src={firstImg}
                                alt={jsonData?.name}
                              />
                              ):(

                                <Image
                                ml={2}
                                boxSize='300px'
                                src={nftImage}
                                alt={jsonData?.name} 
                                />
                              )}
                              <Stack>
                                <CardBody>
                                {nftImage == DOMAIN_IMAGE_URL ?  (


                                <Button size="sm" variant='solid' colorScheme='blue' onClick={() => updateImage()}>
                                        {isLoading ? (

                                            <>  <CircularProgress isIndeterminate size="24px" /> Wait... </>
                                          ) : (
                                            'Generate NFT Image'
                                          )}
                                    </Button>
                                       )
                                      :
                                      (<></>)}
                                </CardBody>
                             

                                <CardFooter>
                         
                                  {address == ownerAddress ? (
                                    <div>
                                      { show ?  (
                                      <Button size="sm" rightIcon={<FaForward />} colorScheme="teal" type="submit" width="half" mt={4}>
                                        Replace Image
                                      </Button>
                                   
                                      ): (<></>)}
                                      {jsonDataNew != null ? (
                                        <Button size="sm" ml="1" rightIcon={<FaForward />} colorScheme="green" width="half" mt={4} onClick={() => handleUpload()} >

                                          {isLoading ? (

                                            <>  <CircularProgress isIndeterminate size="24px" /> Submitting </>
                                          ) : (
                                            'Verify'
                                          )}

                                        </Button>
                                      ) : (
                                        <></>
                                      )}

                              &nbsp;
                                      {claimUrl != 'http://web3domain.org' ? (<TokenURI domainName={domain} TokenURI={claimUrl} />) : (<></>)}

                                    </div>
                                  ) : (<>Not authorized</>)}


                                </CardFooter>
                              </Stack>
                            </Card>
                          </form>
                          :

                          <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>You are not authorized.</AlertTitle>
                          </Alert>

                        }

                      </p>



                    )}
                  </>
                )}

              </Stack>
            ) :
              (<>{NETWORK_ERROR}</>)
            }
          </Box>
        </Container>

      </Box>

    </Flex>
  )
}

package oidc.configuration;

import com.nimbusds.jose.jwk.RSAKey;
import eu.olympus.client.CombinedIdPRESTConnection;
import eu.olympus.client.PestoClient;
import eu.olympus.client.PestoIdPRESTConnection;
import eu.olympus.client.SoftwareClientCryptoModule;
import eu.olympus.client.interfaces.ClientCryptoModule;
import eu.olympus.client.interfaces.UserClient;
import eu.olympus.model.Attribute;
import eu.olympus.model.Operation;
import eu.olympus.model.Policy;
import eu.olympus.model.Predicate;
import java.security.SecureRandom;
import java.security.interfaces.RSAPublicKey;
import java.util.*;
import javax.net.ssl.HostnameVerifier;
import oidc.model.DiscoveryLoader;
import oidc.model.Storage;
import org.apache.http.conn.ssl.DefaultHostnameVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@Configuration
public class OidcConfiguration {

    @Value("${pesto.servers.http}")
    private String servers;

    /**
     * Initiates the user client. Requires that all pesto IDPs are running.
     *
     * @return user client
     */

    @Bean
    public UserClient createUserClient() {
        String[] serverArray = servers.split(",");
        List<PestoIdPRESTConnection> idps = new ArrayList<PestoIdPRESTConnection>();
        System.out.println(idps); // Assuming CombinedIdPRESTConnection has a meaningful toString() method

        UserClient client = null;
        Properties systemProps = System.getProperties();
        systemProps.put("javax.net.ssl.trustStore", "src/test/resources/truststore.jks");
        systemProps.put("javax.net.ssl.trustStorePassword", "OLYMPUS");
        // Ensure that there is a certificate in the trust store for the webserver connecting
        HostnameVerifier verifier = new DefaultHostnameVerifier();
        javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(verifier);

        for (int i = 0; i < serverArray.length; i++) {
            System.out.println("Server " + (i + 1) + ": " + serverArray[i]);
            PestoIdPRESTConnection idp = new PestoIdPRESTConnection(serverArray[i], "", i, 100000);
            idps.add(idp);
        }
        System.out.println("Number of IDPs added to the list: " + idps.size());

        ClientCryptoModule crypto = new SoftwareClientCryptoModule(new SecureRandom(), ((RSAPublicKey) idps.get(0).getCertificate().getPublicKey()).getModulus());
        client = new PestoClient(idps, crypto);
        return client;
    }

    /**
     * The policy used when authenticating a login request.
     * TODO: Currently configured for the "usecase 3" setup, ie. name and birthdate is revealed
     * Could be any standard claim of OIDC : https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
     *
     * @return policy
     */
    @Bean
    /**
     * The policy used when authenticating a login request.
     * SOS
     * Could be any standard claim of OIDC : https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
     *SOS
     * @return policy
     */
    public Policy policy() {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(new Predicate("name", Operation.REVEAL, null));
        predicates.add(new Predicate("birthdate", Operation.REVEAL, null));
//       predicates.add(new Predicate("given_name", Operation.REVEAL, null));
        //Clinician ID for policy because openid
        predicates.add(new Predicate("nickname", Operation.REVEAL, null));
        //email for policy because openid
        predicates.add(new Predicate("middle_name", Operation.REVEAL, null));
//        User number for policy because openid
        predicates.add(new Predicate("given_name", Operation.REVEAL, null));

        Policy policy = new Policy();
        policy.setPredicates(predicates);
        return policy;
    }
    @Bean
    public Storage storage() {

        Map<String, Attribute> attributes = new HashMap<>();

        attributes.put("url:YearsOfStudies", new Attribute("YearsOfStudies"));
        attributes.put("url:Address", new Attribute("Address"));
        attributes.put("url:Studentid", new Attribute("Studentid"));
        attributes.put("url:PhoneNumber", new Attribute("PhoneNumber"));
        Storage storage = new Storage();
        storage.storeCredential(storage.getCredential());
        storage.checkCredential();
        storage.deleteCredential();
        return storage;
    }
    @Bean
    public RSAKey certs() throws Exception {
        String[] serverArray = servers.split(",");
        PestoIdPRESTConnection idp = new PestoIdPRESTConnection(serverArray[0], "", 0, 100000);
        return new RSAKey.Builder((RSAPublicKey) idp.getCertificate().getPublicKey()).build();
    }

    @Bean
    public DiscoveryLoader discoveryLoader() {
        return new DiscoveryLoader("src/main/resources/openid-configuration-discovery");
    }

    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
    }

}

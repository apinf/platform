package testpack;

import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import junit.framework.Test;
import junit.framework.TestSuite;
import junit.textui.TestRunner;

@RunWith(Suite.class)
@SuiteClasses({SearchButtonTest.class, SearchNonExistentApi.class})
public class DiporeTestSuite {

	public static WebDriver driver;
	
    public static Test suite() {
    	TestSuite suite = new TestSuite("Dipore tests");
    	suite.addTestSuite(SearchButtonTest.class);
    	suite.addTestSuite(SearchNonExistentApi.class);
    	return suite;
    }
    
    public static void main(String[] args) {
    	TestRunner.run(suite());
    }
    
    @BeforeClass
    public static void setUp() throws Exception {
    	driver = new FirefoxDriver();
    	driver.get("https://nightly.apinf.io/");
    	driver.manage().window().maximize();
    	driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
    }
    
    @AfterClass
    public static void tearDown() throws Exception {
    	driver.close();
    	driver.quit();
    }
}

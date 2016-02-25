package testpack;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import junit.framework.TestCase;

public class SearchButtonTest extends TestCase {
	
	@Test
	public void testSearchButtonOnHomePage() {
		DiporeTestSuite.driver.findElement(By.xpath("//span[@class='search-button']")).click();
		WebElement element = DiporeTestSuite.driver.findElement(By.xpath("//h1[text() = 'Search APIs']"));
		assertTrue(element.isDisplayed());
	}

}

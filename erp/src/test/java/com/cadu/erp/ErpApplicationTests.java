package com.cadu.erp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestConfig.class)
class ErpApplicationTests {

	@Test
	void contextLoads() {
	}

}

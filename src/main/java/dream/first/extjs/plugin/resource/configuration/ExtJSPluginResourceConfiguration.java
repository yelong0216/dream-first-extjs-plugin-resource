package dream.first.extjs.plugin.resource.configuration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import dream.first.extjs.base.resource.servlet.ServletResourceTemplateParameterNameTool;
import dream.first.extjs.base.resource.servlet.ServletResourceTemplateParameterProcessor;
import dream.first.extjs.plugin.resource.servlet.StaticResourceServletRegistrationBean;

public class ExtJSPluginResourceConfiguration {

	@Bean
	@Order(Ordered.HIGHEST_PRECEDENCE + 1)
	public ServletResourceTemplateParameterProcessor resourceCommonlibPathTemplateParameterProcessor() {
		return x -> {
			x.put(ServletResourceTemplateParameterNameTool.commonLibPath,
					"/resources/extjs/plugin/resource/common/commonlib.jsp");
			x.put(ServletResourceTemplateParameterNameTool.rsaPath,
					"/resources/extjs/plugin/resource/common/rsa.jsp");
			x.put(ServletResourceTemplateParameterNameTool.sm3Path,
					"/resources/extjs/plugin/resource/common/sm3.jsp");
			x.put(ServletResourceTemplateParameterNameTool.sm4Path,
					"/resources/extjs/plugin/resource/common/sm4.jsp");
			return x;
		};
	}

	// ==================================================资源==================================================

	@Bean
	@ConditionalOnMissingBean
	public StaticResourceServletRegistrationBean staticResourceServletRegistrationBean() {
		return new StaticResourceServletRegistrationBean();
	}

}

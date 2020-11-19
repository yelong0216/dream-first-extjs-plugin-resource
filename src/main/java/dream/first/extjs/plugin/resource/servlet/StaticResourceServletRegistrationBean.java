package dream.first.extjs.plugin.resource.servlet;

import org.yelong.support.servlet.resource.ResourceServlet;
import org.yelong.support.spring.boot.servlet.resource.ResourceServletRegistrationBean;

import dream.first.extjs.plugin.resource.servlet.StaticResourceServletRegistrationBean.StaticResourceServlet;

/**
 * 静态资源
 */
public class StaticResourceServletRegistrationBean extends ResourceServletRegistrationBean<StaticResourceServlet> {

	// 这里要以/开头，不然资源获取不到
	public static final String urlPrefix = "/resources/extjs/plugin/resource";

	public static final String resourceRootPath = "/dream/first/extjs/plugin/resources/publics/extjs/plugin/resource";

	public StaticResourceServletRegistrationBean() {
		this(urlPrefix);
	}

	public StaticResourceServletRegistrationBean(String urlPrefix) {
		this(urlPrefix, resourceRootPath);
	}

	public StaticResourceServletRegistrationBean(String urlPrefix, String resourceRootPath) {
		super(urlPrefix, resourceRootPath, new StaticResourceServlet());
	}

	public static class StaticResourceServlet extends ResourceServlet {

		private static final long serialVersionUID = -454745587938652439L;

	}

}

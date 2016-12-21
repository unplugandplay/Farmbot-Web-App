require "json"
require "pry"
require "rails"

class CSArg
    TRANSLATIONS = { "integer" => "number",
                     "string"  => "string" }
    attr_reader :name, :allowed_values

    def initialize(name:, allowed_values:)
        @name, @allowed_values = name, allowed_values
    end

    def camelize
      name.camelize
    end

    def values
      allowed_values.map { |v| TRANSLATIONS[v] || v.camelize }.join("|")
    end

    def to_ts
"""
interface #{camelize} {
  #{name}: #{values};
}
"""
    end
end

class CSNode
    attr_reader :name, :allowed_args, :allowed_body_types

    def initialize(name:, allowed_args:, allowed_body_types: [])
        @name,
        @allowed_args,
        @allowed_body_types = name, allowed_args, allowed_body_types
    end

    def camelize
        name.camelize
    end

    def arg_names
        allowed_args.map(&:camelize).join(", ")
    end

    def body_names
        b = allowed_body_types.map(&:camelize).join("|")
        b.length > 0 ? b : "undefined"
    end

    def args

    end

    def to_ts
"""
  interface #{camelize}Args extends #{arg_names} { }

  type #{camelize}BodyNode = #{ body_names };

  interface #{camelize} {
    kind: #{name.inspect};
    args: #{camelize}Args;
    body: #{camelize}BodyNode[]|undefined;
  };
"""
    end
end

HASH  = JSON.parse(File.read("./latest_corpus.json")).deep_symbolize_keys
ARGS  = HASH[:args].map  { |x| CSArg.new(x) }
NODES = HASH[:nodes].map { |x| CSNode.new(x) }
ALL = NODES.map(&:name).map(&:camelize).join("|");
result = ARGS.map(&:to_ts)
result += NODES.map(&:to_ts)
result.push "type CeleryNode = #{ALL};"
puts result.join("\n")
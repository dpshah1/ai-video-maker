from manim import *

class GraphColoring(Scene):
    def construct(self):

        title = Text("Graph Coloring: Maps and Beyond", font_size=36)
        self.play(Write(title))
        self.wait(1)

        key_concepts = Text("Key Concepts: Graph Coloring, Chromatic Number", font_size=24)
        self.play(Write(key_concepts))
        self.wait(1)

        graph = Graph(
            vertices=["A", "B", "C", "D", "E"],
            edges=[("A", "B"), ("A", "C"), ("B", "C"), ("C", "D"), ("D", "E"), ("E", "A")],
            layout="spring",
            vertex_config={"color": WHITE, "radius": 0.2},
            edge_config={"stroke_width": 2}
        )
        self.play(Create(graph))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle), run_time=0.5)
        self.wait(0.5)

        adjacent_text = Text("Adjacent vertices cannot share the same color!", font_size=24)
        self.play(Write(adjacent_text))
        self.wait(1)

        map_image = Circle(radius=0.5).scale(0.5)
        self.play(FadeIn(map_image))
        self.wait(1)

        colors = [RED, GREEN, BLUE, YELLOW, PURPLE]
        for color in colors:
            self.play(map_image.set_fill(color, 0.5))
            self.wait(0.5)

        final_message = Text("Every planar graph can be colored with at most five colors!", font_size=24)
        self.play(Write(final_message))
        self.wait(1)

        self.play(FadeOut(title), FadeOut(key_concepts), FadeOut(graph), FadeOut(adjacent_text), FadeOut(map_image), FadeOut(final_message))
        self.wait(1)

        self.wait(35.6 - self.time_elapsed)